import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllPhoto } from "../../utils/data/PhotoAPI";
import HashLoader from "react-spinners/HashLoader";

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getAllPhoto();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("Expected an array but got:", response);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Menghapus setTimeout karena tidak perlu menunda fetching
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-medium text-font1">
              Galeri
            </h1>
            <p className="text-sm sm:text-base text-font3">
              Galeri berisi kumpulan foto-foto dari instansi
            </p>
          </div>
          <button
            onClick={() => navigate("/add-galeri")}
            className="flex items-center text-sm bg-primary text-white hover:bg-secondary hover:text-white py-2 px-4 rounded-md w-fit"
          >
            <Plus size={18} className="cursor-pointer mr-2" />
            Tambah Foto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <HashLoader color="#C0392B" size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post._id || index} // Gunakan _id sebagai key untuk unik
                className="border border-gray-300 bg-white p-4 sm:p-5 rounded flex flex-col"
              >
                {/* Image Section */}
                {post.images && post.images.length > 0 && (
                  <div className="relative h-48 sm:h-72 rounded overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Title Section */}
                <h1
                  onClick={() => navigate(`/galeri/${post._id}`)}
                  className="text-base sm:text-lg font-semibold hover:underline cursor-pointer mt-4"
                >
                  {post.title}
                </h1>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 text-sm sm:text-base">
              Tidak ada galeri yang tersedia.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
