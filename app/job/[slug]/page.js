import Jobdetails from "../../_component/Jobdetails";
import { getJobDetailQuery } from "../../data-layer/contentful/graphquerys";

export default async function JobPage({ params }) {
    const { slug } = await params;  

    return (
        <Jobdetails slug={slug}/>
    );
}
