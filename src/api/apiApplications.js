import { createClerkSupabaseClient } from "@/utils/supabase";

export async function applyToJob(session, _, jobData) {
  const supabase = createClerkSupabaseClient(session);

  const random = Math.floor(Math.random() * 90000);

  const file = jobData.resume;

  // Keep the original file extension
  const fileExtension = file.name.split(".").pop();

  const fileName = `resume-${random}-${jobData.candidate_id}.${fileExtension}`;

  // 1. Upload resume to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error Uploading Resume:", uploadError);
    throw uploadError;
  }

  // 2. Get the public URL of uploaded resume
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("resumes")
    .getPublicUrl(fileName);

  // 3. Insert application into database
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume: publicUrl,
      },
    ])
    .select();

  if (error) {
    console.error("Error Submitting Application:", error);
    throw error;
  }

  return data;
}

export async function updateApplicationStatus(session, { job_id }, status) {
  const supabase = createClerkSupabaseClient(session);
  
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(session,{ user_id }) {
  const supabase = createClerkSupabaseClient(session);
  
  const { data, error } = await supabase
    .from("applications")
    .select("*, job: jobs(title, company: companies(name))")
    .eq("candidate_id", user_id)
    

  if (error) {
    console.error("Error Fetching Applications:", error);
    return null;
  }

  return data;
}
