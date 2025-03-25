import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Stratos Secure File Drop</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Securely share files with no login, no tracking, and no centralized server. 
          Files are stored on the Stratos SPFS decentralized network.
        </p>
        <div className="mt-3 text-amber-600 font-medium">
          Current maximum file size limit is 100MB
        </div>
      </header>

      <FileUploader />

      <footer className="mt-16 py-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Powered by <a href="https://www.thestratos.org/" className="text-blue-500 hover:text-blue-600 font-medium">Stratos Network</a>
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">How It Works</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
