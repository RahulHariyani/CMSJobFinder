const Footer = () => {
  return (
    <footer className="mt-auto border-t theme-border-line theme-bg-footer text-[#c8d6df]">
      <div className="container-max py-10">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <div className="brand-title text-lg font-bold text-white">CMS Job Finder</div>
            <div className="mt-2 text-sm text-[#9fb5c3]">Find curated CMS jobs and grow your career.</div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-[#9fb5c3]">
          © {new Date().getFullYear()} CMS Job Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
