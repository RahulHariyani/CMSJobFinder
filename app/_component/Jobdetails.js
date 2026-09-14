import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getJobDetailQuery } from "../data-layer/contentful/graphquerys";
import Link from "next/link";
import Image from "next/image";

const Jobdetails = async ({slug}) =>{

    const response = await fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.space}/environments/${process.env.environment}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: getJobDetailQuery, variables: { slug } }),
        }
    ).then((res) => res.json());

    const job = response?.data?.jobCollection?.items?.[0];

    if (!job) {
        return (
            <div className="container-max flex-1 py-16 md:py-20">
                <h1 className="brand-title text-3xl font-extrabold tracking-tight theme-text-main">
                    Job not found
                </h1>
                <p className="mt-3 theme-text-soft">
                    No job matches “{slug}”.
                </p>
                <a href="/" className="mt-6 inline-block rounded-full border theme-border-line px-5 py-2 text-sm font-semibold theme-text-main transition hover:border-indigo-500 hover:text-indigo-600">
                    ← Back to jobs
                </a>
            </div>
        );
    }

    const company = job.company;
    const tags = job.contentfulMetadata?.tags ?? [];
    const salary = job.baseAnnualSalary
        ? `$${Number(job.baseAnnualSalary).toLocaleString()}`
        : null;
    const postedOn = job.datePosted
        ? new Date(job.datePosted).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <div className="container-max flex-1 py-12 md:py-16">
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium theme-text-soft transition hover:text-indigo-600">
                ← Back to jobs
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
                <div className="flex flex-col gap-8">
                    {/* Header card */}
                    <div className="glass-panel rounded-2xl p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                            {job.jobType && (
                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                    {job.jobType}
                                </span>
                            )}
                            {job.experienceLevel && (
                                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                                    {job.experienceLevel}
                                </span>
                            )}
                        </div>

                        <h1 className="brand-title mt-4 text-3xl font-extrabold tracking-tight theme-text-main md:text-4xl">
                            {job.title}
                        </h1>

                        {company?.name && (
                            <div className="mt-2 text-base font-medium theme-text-soft">
                                {company.name}
                                {company.slogon ? ` — ${company.slogon}` : ""}
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t theme-border-line pt-6">
                            {salary && (
                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide theme-text-soft">Salary</div>
                                    <div className="brand-title text-lg font-bold theme-text-accent">{salary}</div>
                                </div>
                            )}
                            {postedOn && (
                                <div>
                                    <div className="text-xs font-medium uppercase tracking-wide theme-text-soft">Posted</div>
                                    <div className="text-sm font-semibold theme-text-main">{postedOn}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag.id} className="rounded-full border theme-border-line px-3 py-1 text-xs font-medium theme-text-soft">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    {job.jobDescription?.json && (
                        <div className="glass-panel rounded-2xl p-6 md:p-8">
                            <h2 className="brand-title text-xl font-bold theme-text-main">Job description</h2>
                            <div className="prose-job mt-4 space-y-4 leading-relaxed theme-text-soft">
                                {documentToReactComponents(job.jobDescription.json)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="flex flex-col gap-6">
                    <div className="glass-panel rounded-2xl p-6 text-center">
                        {company?.coverImage?.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image
                                width={20}
                                height={20}
                                src={company.coverImage.url}
                                alt={company.coverImage.title ?? company?.name ?? "Company"}
                                className="mx-auto h-20 w-20 rounded-xl object-cover"
                            />
                        )}
                        {company?.name && (
                            <div className="brand-title mt-4 text-lg font-bold theme-text-main">{company.name}</div>
                        )}
                        {company?.slogon && (
                            <p className="mt-1 text-sm theme-text-soft">{company.slogon}</p>
                        )}
                        {company?.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-block rounded-full border theme-border-line px-5 py-2 text-sm font-semibold theme-text-main transition hover:border-indigo-500 hover:text-indigo-600"
                            >
                                Visit website
                            </a>
                        )}
                    </div>

                    <button className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                        Apply now
                    </button>
                </aside>
            </div>
        </div>
    )

}

export default Jobdetails