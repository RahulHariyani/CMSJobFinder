import { createClient } from "contentful";

export const client = createClient({
    space: process.env.space,
    accessToken: process.env.accessToken,
    environment: process.env.environment
})