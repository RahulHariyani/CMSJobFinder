import {getCompanies} from "@/app/data-layer/contentful/company"
import Jobcard from "@/app/_component/Jobcard"
import SearchFilter from "@/app/_component/SearchFilter"

export default async function Home({ searchParams }) {

  //const companies = await getCompanies()
  const sp = await searchParams

  return (
    <div id="jobs" className="container-max flex-1 py-20 md:py-24">
      <div className="mb-12 flex items-end justify-between">
        <h2 className="brand-title text-3xl font-extrabold tracking-tight theme-text-main md:text-4xl mb-10 mt-10">
          Latest Jobs
        </h2>
        <span className="text-sm font-medium theme-text-soft"><SearchFilter /></span>
      </div>
      <Jobcard searchParams={sp} />
    </div>
  );
}
