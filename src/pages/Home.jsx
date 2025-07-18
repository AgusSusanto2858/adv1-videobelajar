import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HomeLayouts from '../layouts/HomeLayouts'
import Hero from '../components/molecules/Hero'
import Newsletter from '../components/molecules/Newsletter'
import CourseGrid from '../components/organisms/CourseGrid'
import { getAllCourses, getCoursesByCategory, categories } from '../data/CoursesData'

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('Semua Kelas');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const location = useLocation();

    // Load courses data from API
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const courses = await getAllCourses();
                setAllCourses(courses);
                
                // Apply filter berdasarkan kategori aktif
                if (activeCategory === 'Semua Kelas') {
                    setFilteredCourses(courses);
                } else {
                    const filtered = courses.filter(course => course.category === activeCategory);
                    setFilteredCourses(filtered);
                }
            } catch (error) {
                console.error('Error loading courses:', error);
                setError('Gagal memuat data kursus. Silakan refresh halaman.');
                setAllCourses([]);
                setFilteredCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCourses();
    }, [activeCategory]); // Dependency pada activeCategory

    // Check login state from localStorage and location state
    useEffect(() => {
        // Check if user came from login/register
        if (location.state?.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(location.state.user);
        } else {
            // Check localStorage for persistent login
            const storedLoginState = localStorage.getItem('isLoggedIn');
            const storedUser = localStorage.getItem('user');
            
            if (storedLoginState === 'true' && storedUser) {
                setIsLoggedIn(true);
                setUser(JSON.parse(storedUser));
            }
        }
    }, [location.state]);

    const handleCategoryChange = async (category) => {
        setActiveCategory(category);
        setIsLoading(true);
        
        try {
            // Filter courses berdasarkan kategori yang dipilih
            if (category === 'Semua Kelas') {
                setFilteredCourses(allCourses);
            } else {
                const filtered = allCourses.filter(course => course.category === category);
                setFilteredCourses(filtered);
            }
        } catch (error) {
            console.error('Error filtering courses:', error);
            setError('Gagal memfilter kursus.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        // localStorage sudah di-clear oleh Navbar component
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <>
            <HomeLayouts 
                isLoggedIn={isLoggedIn} 
                user={user}
                onLogout={handleLogout}
            >
                <Hero />
                
                {/* Main Content Container with consistent gaps */}
                <div className="px-4 sm:px-8 pt-4 md:pt-8 lg:pt-12">
                    <div className="flex flex-col w-full max-w-[1170px] mx-auto">
                        
                        {/* Title Section */}
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold text-2xl md:text-3xl text-gray-800">
                                Koleksi Video Pembelajaran Unggulan
                            </h3>
                            <p className="font-medium text-base text-gray-500">
                                Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
                            </p>
                        </div>

                        {/* Dynamic Tabs */}
                        <div className="flex gap-1 overflow-x-auto">
                            {categories.map((category) => (
                                <div 
                                    key={category}
                                    className={`flex flex-col gap-2 px-9 py-3 cursor-pointer transition-colors ${
                                        activeCategory === category ? '' : ''
                                    }`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    <button 
                                        className={`font-medium text-base whitespace-nowrap transition-colors ${
                                            activeCategory === category 
                                                ? 'text-orange-500' 
                                                : 'text-gray-500 hover:text-orange-400'
                                        }`}
                                        type="button"
                                        disabled={isLoading}
                                    >
                                        {category}
                                    </button>
                                    {activeCategory === category && (
                                        <div className="w-13 h-1.5 rounded-lg bg-orange-500"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-blue-100">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memuat kursus...
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="text-center py-12">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-red-800 mb-2">Oops! Ada Masalah</h3>
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={handleRefresh}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Refresh Halaman
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Course Grid with filtered courses */}
                        {!isLoading && !error && (
                            <>
                                <CourseGrid courses={filteredCourses} />

                                {/* Course Statistics */}
                                <div className="text-center py-4">
                                    <p className="text-gray-600">
                                        Menampilkan {filteredCourses.length} dari {allCourses.length} kursus tersedia
                                        {activeCategory !== 'Semua Kelas' && (
                                            <span className="text-orange-600 font-medium"> dalam kategori "{activeCategory}"</span>
                                        )}
                                    </p>
                                    {filteredCourses.length === 0 && activeCategory !== 'Semua Kelas' && (
                                        <p className="text-gray-500 mt-2">
                                            Tidak ada kursus untuk kategori ini.
                                        </p>
                                    )}
                                    {allCourses.length === 0 && (
                                        <p className="text-gray-500 mt-2">
                                            Belum ada kursus yang tersedia.
                                        </p>
                                    )}
                                </div>

                                {/* API Status Info */}
                                <div className="text-center py-2">
                                    <p className="text-xs text-gray-400">
                                        Data dimuat dari MockAPI.io • Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Newsletter />
            </HomeLayouts>
        </>
    )
}