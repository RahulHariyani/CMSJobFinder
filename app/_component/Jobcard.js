import Link from "next/link";
import { getJobs } from "../data-layer/contentful/jobs"

const Jobcard = async ({searchParams}) => {

    let jobs = await getJobs();
    const searchquery = searchParams?.job

    if (searchquery) {
        jobs = jobs.filter((job) =>
            job?.fields?.title?.toLowerCase().includes(searchquery.toLowerCase())
        )
    }

    return (
        <ul className="job-grid list-none p-0">
           { jobs.length != 0  ? jobs.map((job) => (
                <li
                    key={job.sys.id}
                    className={`job-tile flex flex-col gap-4 ${
                        job.fields.featuredJob
                            ? "ring-2 ring-amber-400/60 ring-offset-2 ring-offset-transparent"
                            : ""
                    }`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="brand-title text-lg font-bold theme-text-main">
                            {job?.fields?.title}
                        </h3>
                        {job.fields.experienceLevel && (
                            <span className="whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                {job.fields.experienceLevel}
                            </span>
                        )}
                        {job.fields.featuredJob && (
                            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-300">
                                Featured
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-wide theme-text-soft">
                                Salary
                            </div>
                            <div className="brand-title text-base font-bold theme-text-accent">
                                {job.fields.baseAnnualSalary
                                    ? `$${Number(job.fields.baseAnnualSalary).toLocaleString()}`
                                    : "—"}
                            </div>
                        </div>
                        <Link href={`job/${job.fields.slug}`} className="rounded-full border theme-border-line px-4 py-1.5 text-sm font-semibold theme-text-main transition hover:border-indigo-500 hover:text-indigo-600">
                            View
                        </Link>
                    </div>
                </li>
            )) : "No Available Jobs"}
        </ul>
    )
}

export default Jobcard