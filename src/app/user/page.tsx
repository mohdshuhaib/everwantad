'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdBox from '@/components/AdBox';
import AdModal from '@/components/AdModal';
import { Ad, AdFormData } from '@/types/global';
import { RxAvatar } from 'react-icons/rx';

export default function UserPage() {
  const [purchasedBoxes, setPurchasedBoxes] = useState<number[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
      router.push('/login');
      return false;
    }
    setUser(user);
    return true;
  }, [router]);

  const fetchAds = useCallback(async (userId: string): Promise<void> => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ads:', error);
      return;
    }

    if (data) {
      setAds(data as Ad[]);
      const purchased = data
        .map(ad => ad.box_index)
        .filter((index): index is number => index !== null);
      setPurchasedBoxes(purchased);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      if (user) {
        await fetchAds(user.id);
        setIsLoading(false);
      }
    };

    loadData();

    const subscription = supabase
      .channel('ads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ads' },
        async (payload) => {
          const isAuthenticated = await checkAuth();
          if (!isAuthenticated) return;

          switch (payload.eventType) {
            case 'INSERT':
              setAds(prev => [payload.new as Ad, ...prev]);
              if (payload.new.box_index !== null) {
                setPurchasedBoxes(prev => [...prev, payload.new.box_index]);
              }
              break;
            case 'UPDATE':
              setAds(prev =>
                prev.map(ad => (ad.id === payload.new.id ? (payload.new as Ad) : ad))
              );
              break;
            case 'DELETE':
              setAds(prev => prev.filter(ad => ad.id !== payload.old.id));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [checkAuth, fetchAds, user]);

  const handleBoxClick = (index: number) => {
    if (purchasedBoxes.includes(index)) {
      setSelectedBox(index);
      setIsModalOpen(true);
    } else {
      alert('Redirecting to payment gateway...');
      setTimeout(() => {
        setPurchasedBoxes(prev => [...prev, index]);
      }, 2000);
    }
  };

  const handleAdSubmit = async (data: AdFormData) => {
    if (!user) return;

    try {
      let imageUrl = data.image_url || '';

      if (data.image instanceof File) {
        const imagePath = `ads/${user.id}/${Date.now()}_${data.image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(imagePath, data.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('ad-images')
          .getPublicUrl(imagePath);
        imageUrl = urlData.publicUrl;
      }

      const adData = {
        ...data,
        image_url: imageUrl,
        user_id: user.id,
        box_index: selectedBox
      };

      if (data.id) {
        const { error } = await supabase
          .from('ads')
          .update(adData)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([adData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Failed to save ad. Please try again.');
    }
  };

  const handleAdDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad. Please try again.');
    }
  };

  const filteredAds = ads.filter(ad =>
    ad.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ad.description && ad.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
          Welcome to Your Dashboard
        </h1>
        <div className="flex items-center mt-4">
          <RxAvatar className="text-3xl text-gray-600 mr-2" />
          <p className="text-xl md:text-2xl font-semibold text-green-600">
            {user?.email || 'User'}
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Your Ad Spaces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <AdBox
                key={index}
                isPurchased={purchasedBoxes.includes(index)}
                onClick={() => handleBoxClick(index)}
                className="w-full aspect-square border-2 border-gray-200 hover:border-green-400 transition-colors"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Your Advertisements</h2>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search ads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          </div>

          {filteredAds.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No advertisements found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAds.map(ad => (
                <div key={ad.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                    {ad.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={ad.image_url}
                          alt={ad.heading}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{ad.heading}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{ad.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Box #{ad.box_index}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {new Date(ad.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBox(ad.box_index || null);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleAdDelete(ad.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <AdModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBox(null);
        }}
        onSubmit={handleAdSubmit}
        initialData={ads.find(ad => ad.box_index === selectedBox) ? {
          id: ads.find(ad => ad.box_index === selectedBox)?.id,
          heading: ads.find(ad => ad.box_index === selectedBox)?.heading || '',
          description: ads.find(ad => ad.box_index === selectedBox)?.description || '',
          image_url: ads.find(ad => ad.box_index === selectedBox)?.image_url,
          box_index: selectedBox || undefined,
          image: null
        } : undefined}
      />
    </div>
  );
}