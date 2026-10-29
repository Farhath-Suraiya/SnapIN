import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserPlus,
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

const AddStudent = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const navigate = useNavigate();

  // 🧹 Cleanup preview URLs (IMPORTANT)
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Prevent duplicates
    const newFiles = selectedFiles.filter(
      (file) => !images.some((img) => img.name === file.name)
    );

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!name.trim() || !rollNumber.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return;
    }

    if (images.length === 0) {
      setMessage({ type: 'error', text: 'Upload at least one image.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('roll_number', rollNumber);

    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/add-student',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({
        type: 'success',
        text: res.data?.message || 'Student added successfully!'
      });

      // Reset form
      setName("");
      setRollNumber("");
      clearAllImages();

      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.error ||
          err.response?.data?.detail ||
          'Failed to add student'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <ArrowLeft className="text-slate-400 hover:text-blue-600" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="text-blue-600" />
            Add Student
          </h1>
          <p className="text-slate-500">Upload student face dataset</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* Upload */}
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-blue-50">
            <Upload />
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  Uploading...
                </span>
              ) : "Add Student"}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* PREVIEW */}
        <div className="bg-gray-50 p-6 rounded-xl min-h-[300px]">

          {previews.length === 0 ? (
            <div className="text-center text-gray-400">
              <ImageIcon size={50} className="mx-auto" />
              <p>No images uploaded</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-3">
                <p className="text-sm">Images ({previews.length})</p>
                <button onClick={clearAllImages} className="text-red-500 text-sm">
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-full h-24 object-cover rounded" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default AddStudent;