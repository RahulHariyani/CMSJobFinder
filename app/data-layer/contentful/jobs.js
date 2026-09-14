import { client } from "./client";

export const getJobs = async () =>{
    const jobs = await client.getEntries({content_type: "job"})
    return jobs.items
}
