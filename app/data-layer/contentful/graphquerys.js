export const getJobDetailQuery = `
  query GetJob($slug: String!) {
    jobCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        slug
        baseAnnualSalary
        datePosted
        experienceLevel
        jobType
        jobDescription{
          json
        }
        contentfulMetadata {
           tags {
               id
               name
            }
         }   
        company{
           name
           coverImage{
              title
              url
           }  
           website    
           slogon
        }        
        
      }
    }
  }
`;