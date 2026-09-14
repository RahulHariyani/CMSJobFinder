import { client } from "./client";

export const getCompanies = async () =>{
    const companies = await client.getEntries({content_type: "company"})
    return companies.items
}