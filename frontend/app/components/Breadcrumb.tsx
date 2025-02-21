"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "../context"; // Adjust the import based on your project structure

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const { state } = useAppContext();
  const pathSegments = pathname.split("/").filter(segment => segment);

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" legacyBehavior>
            <a className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              HOME
            </a>
          </Link>
        </li>
        {pathSegments.map((segment, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`} legacyBehavior>
                <a className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </a>
              </Link>
            </div>
          </li>
        ))}
        {pathname === "/" && state.selectedCategory && (
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2 dark:text-gray-400">
                {state.selectedCategory.toUpperCase()}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
