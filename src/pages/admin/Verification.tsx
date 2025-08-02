import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { FileUploader } from "react-drag-drop-files";
import { Handshake, FileText, ShieldCheck, UploadCloud, UserCheck, FileSearch, FileInput, FileOutput } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import CryptoJS from "crypto-js";



interface Document {
  name: string;
  docType: string;
  docHash: string;
  timestamp: bigint | number; // Accepts both, but we'll convert to number
}
const fileTypes = ["PDF", "DOC", "DOCX", "TXT", "ZIP"];

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "admin", "type": "address" }
    ],
    "name": "AdminRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "admin", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "docType", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "docHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "DocumentUploaded",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "name": "getDocuments",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "docType", "type": "string" },
          { "internalType": "string", "name": "docHash", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct DocVault.Document[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "name": "isAdmin",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "name": "registerAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_docType", "type": "string" },
      { "internalType": "string", "name": "_docHash", "type": "string" }
    ],
    "name": "uploadDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = "0x5d314fb40f9e1877D930c685E668dDe400554536";

const ZyntraApp = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [docHash, setDocHash] = useState("");
  const [docs, setDocs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        checkAdminStatus(accounts[0]);
        setStatus("🟢 Wallet connected successfully");
      } catch (err) {
        setStatus("🔴 Error connecting wallet");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStatus("🔴 MetaMask not detected. Please install it.");
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const checkAdminStatus = async (address: string) => {
    try {
      const contract = await getContract();
      const adminStatus = await contract.isAdmin(address);
      setIsAdmin(adminStatus);
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  const handleFileChange = async (files: File | File[]) => {
  // If multiple files are uploaded, just take the first one
  const file = Array.isArray(files) ? files[0] : files;
  
  if (!file) return;

  setSelectedFile(file);
  setDocName(file.name);
  setDocType(file.type.split('/')[1].toUpperCase());

  // Generate preview for images and PDFs
  if (file.type.includes("image")) {
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  } else if (file.type === "application/pdf") {
    setFilePreview("pdf");
  } else {
    setFilePreview(null);
  }

  // Calculate file hash
  try {
    setIsLoading(true);
    const hash = await calculateFileHash(file);
    setDocHash(hash);
    setStatus(`🔵 File ready: ${file.name}`);
  } catch (err) {
    setStatus("🔴 Error processing file");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  const calculateFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          // Handle ZIP files
          if (file.type === "application/zip" || file.name.endsWith(".zip")) {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(arrayBuffer);
            let combinedContent = "";
            
            // Process each file in the ZIP
            for (const [name, file] of Object.entries(zipContent.files)) {
              if (!file.dir) {
                const content = await file.async("text");
                combinedContent += name + content;
              }
            }
            
            const hash = CryptoJS.SHA256(combinedContent).toString();
            resolve(hash);
          } else {
            // Handle other files
            const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
            const hash = CryptoJS.SHA256(wordArray).toString();
            resolve(hash);
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadDoc = async () => {
    if (!selectedFile || !docHash) {
      setStatus("🔴 Please select a file first");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("🟠 Uploading document to blockchain...");

      const contract = await getContract();
      const tx = await contract.uploadDocument(docName, docType, docHash);
      await tx.wait();

      setStatus("🟢 Document uploaded successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 8000);
      fetchDocs();
    } catch (err) {
      console.error(err);
      setStatus("🔴 Upload failed. " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

 const fetchDocs = async () => {
  if (!account) return;

  try {
    setIsLoading(true);
    const contract = await getContract();
    const result: Document[] = await contract.getDocuments(account);
    
    const formattedDocs = result.map(doc => ({
      ...doc,
      timestamp: Number(doc.timestamp) // Convert to number
    }));
    
    setDocs(formattedDocs);
    setStatus(`🟢 Loaded ${result.length} documents`);
  } catch (err) {
    console.error(err);
    setStatus("🔴 Error fetching documents");
  } finally {
    setIsLoading(false);
  }
};

// In your document display component:
{docs.map((doc, i) => (
  <motion.div key={i} className="bg-gray-700 rounded-lg p-3">
    {/* ... other fields ... */}
    <p className="text-xs text-gray-400">
      {new Date(doc.timestamp * 1000).toLocaleString()}
    </p>
  </motion.div>
))}

  const registerAsAdmin = async () => {
    if (!account) return;

    try {
      setIsLoading(true);
      setStatus("🟠 Registering as admin...");
      const contract = await getContract();
      const tx = await contract.registerAdmin(account);
      await tx.wait();
      setIsAdmin(true);
      setStatus("🟢 Successfully registered as EV admin!");
    } catch (err) {
      console.error(err);
      setStatus("🔴 Registration failed. You must be the contract owner.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (accounts[0]) checkAdminStatus(accounts[0]);
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold">Zyntra EV Admin Verification</h1>
          </div>
          
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${account 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "bg-blue-600 hover:bg-blue-700"} ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <section className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileInput className="mr-2" /> Document Upload
          </h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <FileUploader 
                handleChange={handleFileChange} 
                name="file" 
                types={fileTypes}
                disabled={isLoading}
              >
                <div className="space-y-2">
                  <UploadCloud size={48} className="mx-auto text-gray-400" />
                  <p className="text-gray-300">Drag & drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, TXT, ZIP</p>
                </div>
              </FileUploader>
            </div>

            {selectedFile && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {filePreview === "pdf" ? (
                    <div className="bg-red-500 p-3 rounded-lg">
                      <FileText size={24} />
                    </div>
                  ) : filePreview ? (
                    <img src={filePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                  ) : (
                    <div className="bg-gray-600 p-3 rounded-lg">
                      <FileText size={24} />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-400">
                      {Math.round(selectedFile.size / 1024)} KB • {docType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      Hash: {docHash}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={uploadDoc}
                disabled={!selectedFile || isLoading}
                className={`flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${(!selectedFile || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    <span>Upload to Blockchain</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Admin Registration */}
          {account && !isAdmin && (
            <div className="mt-8 bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <UserCheck className="mr-2" /> Admin Registration
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Register as an EV admin to upload verification documents.
              </p>
              <button
                onClick={registerAsAdmin}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserCheck size={16} />
                    <span>Register as Admin</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Documents Section */}
        <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileSearch className="mr-2" /> My Documents
            </h2>
            <button
              onClick={fetchDocs}
              disabled={isLoading}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg flex items-center space-x-1"
            >
              <FileOutput size={14} />
              <span>Refresh</span>
            </button>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileSearch size={48} className="mx-auto mb-2" />
              <p>No documents found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {docs.map((doc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.timestamp * 1000).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        Hash: {doc.docHash}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Status Bar */}
      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-gray-800 rounded-lg p-3 text-sm">
          {status || "Ready"}
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
  {showSuccess && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gray-800 rounded-xl p-8 max-w-md text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, -5, 5, 0],
            y: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 1.1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: 2, // Repeats the animation 2 more times (total 3 times)
            repeatDelay: 0.5,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <Handshake 
            size={80} 
            className="mx-auto text-emerald-400"
          />
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-4">Document Secured!</h3>
        <p className="text-gray-300 mb-6 text-lg">
          Your verification is permanently stored on the Zyntra blockchain
        </p>
        
        <button
          onClick={() => setShowSuccess(false)}
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg text-lg font-medium"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default ZyntraApp;