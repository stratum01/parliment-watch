import React from 'react';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-sm font-semibold text-gray-900 uppercase">Parliament Watch</h2>
            <p className="mt-2 text-sm text-gray-600">
              Data visualization for Canadian parliamentary activities
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase">About</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    About This Project
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    Technologies Used
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a 
                    href="https://openparliament.ca" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    OpenParliament.ca
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.parl.ca" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Parliament of Canada
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.ourcommons.ca" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    House of Commons
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {currentYear} Parliament Watch. All rights reserved.
          </p>
          
          <div className="flex mt-4 space-x-6 sm:mt-0">
            <p className="text-sm text-gray-500">
              Data provided by{' '}
              <a
                href="https://openparliament.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenParliament.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;