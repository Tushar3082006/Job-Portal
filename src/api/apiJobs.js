import { createClerkSupabaseClient } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getJobs(
  session,
  { location, company_id, searchQuery }
) {
  const supabase = createClerkSupabaseClient(session);

  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company:companies(name, logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  console.log(" JOB DATA:", data);
  console.log(" JOB ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}

export async function saveJob(session, { alreadySaved }, saveData){
  
  const supabase = createClerkSupabaseClient(session);
  
  if(alreadySaved){
    const { data, error:deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id)

      if(deleteError) {
        console.error("Error Deleting Saved Jobs:", deleteError);
        return null;
      }

      return data;

  }else{
    const { data, error:insertError } = await supabase
      .from("saved_jobs")
      .insert(saveData)
      .select("*");

      if(insertError){
        console.error("Error Inserting saved jobs:", insertError);
        return null;
      }

      return data;

  }

}

export async function getSingleJob(session, {job_id}){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url), application: applications(*)")
    .eq("id", job_id)
    .single();

  if( error ){
    console.error("Error Fetching Company:", error);
    return null;
  }

  return data;
} 

export async function updateHiringStatus(session, {job_id}, isOpen){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if( error ){
    console.error("Error Updating Job:", error);
    return null;
  }

  return data;
} 

export async function addNewJob(session, _, jobData){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if( error ){
    console.error("Error Creating Job:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(session){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company: companies(name, logo_url))");

  if( error ){
    console.error("Error Fetching saved Job:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(session, {recruiter_id}){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url)")
    .eq("recruiter_id", recruiter_id);

  if( error ){
    console.error("Error Fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(session, {job_id}){

  const supabase = createClerkSupabaseClient(session);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if( error ){
    console.error("Error Deleting Job:", error);
    return null;
  }

  return data;
}
