
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TagMyKid. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
