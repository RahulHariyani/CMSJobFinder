import Link from "next/link";

const Header = () => {
    return (
        <header className="hero-banner">
            <div className="container-max hero-inner pb-20 pt-10 text-center md:pb-28 md:pt-16">
                <Link href="/"><span className="hero-eyebrow">Your global CMS career hub</span></Link>
                <h1 className="brand-title mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
                    Find your next CMS job around the globe
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base text-indigo-100 md:text-lg">
                    Discover curated roles for Contentful, AEM, Sitecore and headless CMS developers — all in one beautifully organized place.
                </p>
            </div>
        </header>
    );
};

export default Header;