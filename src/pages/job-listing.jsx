import React, { useState, useEffect } from "react";
import { useSession } from "@clerk/react";
import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/use-fetch";
import { getJobs } from "@/api/apiJobs.js";
import JobCard from "@/components/JobCard";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { session, isLoaded } = useSession();

  const {
    fn: fnjobs,
    data: Jobs,
    loading: loadingJobs,
    error
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const {
    fn: fnCompanies,
    data: Companies,
    loading: loadingCompanies,
    
  } = useFetch(getCompanies);

  useEffect(() => {
    if(isLoaded) fnCompanies();
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded && session) {
      fnjobs();
    }
  }, [isLoaded, session, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if(query) setSearchQuery(query);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  }

  if (!isLoaded || !session) {
    return (      
      <BarLoader
        width={"100%"}
        color= "#36d7b7"
        className="mb-4"
      />
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">

      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Filters */}
      <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
        <Input 
          type="text"
          placeholder= 'Searh Jobs by Title..'
          name= "search-query"
          className= 'h-full flex-1 px-4 text-md'
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className='w-full flex-1' >
            <SelectValue placeholder='Filter by Location' />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger className='w-full flex-1' >
            <SelectValue placeholder='Filter by Company' />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {Companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={clearFilters} variant="destructive" className='w-full flex-1'>
            Clear Filters
        </Button>

      </div>

      {/* Loading */}
      {loadingJobs && (
        <BarLoader
          width={"100%"}
          color= "#36d7b7"
          className="mt-4"
        />
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-center my-5">
          Failed to fetch jobs.
        </div>
      )}

      {/* Jobs */}
      {!loadingJobs && !error && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {Jobs?.length > 0 ? (
            Jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              No Jobs Found!
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default JobListing;