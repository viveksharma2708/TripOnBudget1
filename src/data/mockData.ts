export const packages = [
  {
    id: "pkg-1",
    title: "Magical Ladakh Expedition",
    location: "Ladakh, India",
    duration: "7 Days / 6 Nights",
    price: 28000,
    originalPrice: 35000,
    image: "https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&q=80&w=1000",
    category: "Adventure",
    rating: 4.9,
    reviews: 142,
    description: "Experience the rugged beauty of Ladakh. Visit Pangong Lake, Nubra Valley, and ancient monasteries.",
    itinerary: [
      { day: 1, title: "Arrival in Leh", description: "Acclimatize to the high altitude. Evening visit to Shanti Stupa." },
      { day: 2, title: "Leh Local Sightseeing", description: "Visit Magnetic Hill, Gurudwara Pathar Sahib, and Sangam." },
      { day: 3, title: "Leh to Nubra Valley", description: "Drive via Khardung La Pass. Enjoy a double-humped camel ride in Hunder." },
      { day: 4, title: "Nubra to Pangong Lake", description: "Travel to the stunning Pangong Tso via Shyok river route." },
      { day: 5, title: "Pangong to Leh", description: "Wake up to a beautiful sunrise at Pangong. Drive back to Leh." },
      { day: 6, title: "Monastery Tour", description: "Visit Hemis, Thiksey, and Shey Palace." },
      { day: 7, title: "Departure", description: "Transfer to Leh airport for your onward journey." }
    ],
    inclusions: ["6 Nights Accommodation", "Breakfast & Dinner", "Inner Line Permits", "Oxygen Cylinder in Cab", "Airport Transfers"],
    exclusions: ["Flights", "Lunch", "Camel Ride Fees", "Personal Expenses"],
    gallery: [
      "https://images.unsplash.com/photo-1581793746485-04698e79a4e8?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000"
    ],
    video: "https://www.youtube.com/embed/35npVaFGHMY"
  },
  {
    id: "pkg-2",
    title: "Majestic Manali",
    location: "Himachal Pradesh, India",
    duration: "4 Days / 3 Nights",
    price: 12000,
    originalPrice: 16000,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
    category: "Domestic",
    rating: 4.6,
    reviews: 89,
    description: "Escape to the snow-capped peaks of Manali. Perfect for nature lovers and adventure enthusiasts.",
    itinerary: [
      { day: 1, title: "Arrival in Manali", description: "Check-in to your hotel. Evening stroll on the Mall Road." },
      { day: 2, title: "Solang Valley Excursion", description: "Enjoy adventure activities like paragliding and zorbing in Solang Valley." },
      { day: 3, title: "Local Sightseeing", description: "Visit Hadimba Temple, Vashisht Village, and the Tibetan Monastery." },
      { day: 4, title: "Departure", description: "Check-out and proceed for your onward journey." }
    ],
    inclusions: ["3 Nights Accommodation", "Breakfast & Dinner", "Sightseeing by Private Cab", "Welcome Drink"],
    exclusions: ["Flights/Train", "Adventure Activity Fees", "Lunch", "Personal Expenses"],
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000"
    ],
    video: ""
  },
  {
    id: "pkg-3",
    title: "Spiritual Ujjain & Indore",
    location: "Madhya Pradesh, India",
    duration: "3 Days / 2 Nights",
    price: 9500,
    originalPrice: 13000,
    // Note: Replaced with a placeholder temple image. 
    // To use your uploaded image, please host it online (e.g., Imgur, Cloudinary) and paste the URL here.
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1000",
    category: "Spiritual",
    rating: 4.8,
    reviews: 210,
    description: "A divine journey to the Mahakaleshwar Jyotirlinga and the vibrant food streets of Indore.",
    itinerary: [
      { day: 1, title: "Arrival in Indore & Transfer to Ujjain", description: "Arrive in Indore and drive to Ujjain. Evening visit to Mahakaleshwar Temple." },
      { day: 2, title: "Ujjain Darshan & Indore", description: "Attend Bhasma Aarti (subject to availability). Visit Kal Bhairav. Drive back to Indore and visit Sarafa Bazaar." },
      { day: 3, title: "Indore Sightseeing & Departure", description: "Visit Rajwada Palace and Lal Bagh Palace. Transfer to airport/station." }
    ],
    inclusions: ["2 Nights Accommodation", "Breakfast", "Private Cab Transfers", "Local Sightseeing"],
    exclusions: ["Flights/Train", "VIP Darshan Tickets", "Lunch & Dinner", "Personal Expenses"],
    gallery: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1694065604118-202c42ad71e1?auto=format&fit=crop&q=80&w=1000"
    ],
    video: ""
  },
  {
    id: "pkg-4",
    title: "Goa Weekend Getaway",
    location: "Goa, India",
    duration: "3 Days / 2 Nights",
    price: 8500,
    originalPrice: 12000,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
    category: "Weekend trips",
    rating: 4.5,
    reviews: 156,
    description: "Unwind on the sandy beaches of Goa. Experience the vibrant nightlife and delicious seafood.",
    itinerary: [
      { day: 1, title: "Arrival in Goa", description: "Check-in to your beach resort. Evening at Baga Beach." },
      { day: 2, title: "North Goa Tour", description: "Visit Fort Aguada, Anjuna Beach, and Vagator Beach. Evening cruise on Mandovi River." },
      { day: 3, title: "Departure", description: "Morning shopping at local markets. Transfer to airport/station." }
    ],
    inclusions: ["2 Nights Accommodation", "Breakfast", "Airport/Station Transfers", "North Goa Sightseeing"],
    exclusions: ["Flights/Train", "Meals other than Breakfast", "Cruise Tickets", "Personal Expenses"]
  },
  {
    id: "pkg-5",
    title: "Royal Rajasthan Tour",
    location: "Rajasthan, India",
    duration: "6 Days / 5 Nights",
    price: 24000,
    originalPrice: 30000,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1000",
    category: "Domestic",
    rating: 4.7,
    reviews: 342,
    description: "Experience the rich heritage, majestic forts, and vibrant culture of Jaipur, Jodhpur, and Udaipur.",
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Transfer to hotel. Evening visit to Chokhi Dhani for traditional Rajasthani dinner." },
      { day: 2, title: "Jaipur Sightseeing", description: "Visit Amber Fort, Hawa Mahal, City Palace, and Jantar Mantar." },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur. Evening visit to the local markets." },
      { day: 4, title: "Jodhpur Sightseeing & Drive to Udaipur", description: "Visit Mehrangarh Fort and Umaid Bhawan. Drive to Udaipur." },
      { day: 5, title: "Udaipur Sightseeing", description: "Visit City Palace, Jagdish Temple, and enjoy a boat ride on Lake Pichola." },
      { day: 6, title: "Departure", description: "Transfer to Udaipur airport/station." }
    ],
    inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Private Cab for all transfers", "Lake Pichola Boat Ride"],
    exclusions: ["Flights/Train", "Monument Entry Fees", "Personal Expenses"]
  },
  {
    id: "pkg-6",
    title: "Misty Mussoorie & Dehradun",
    location: "Uttarakhand, India",
    duration: "4 Days / 3 Nights",
    price: 14000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1622278647429-71bc97e904e8?auto=format&fit=crop&q=80&w=1000",
    category: "Weekend trips",
    rating: 4.8,
    reviews: 198,
    description: "Escape to the Queen of Hills. Enjoy the pleasant weather, scenic waterfalls, and colonial charm.",
    itinerary: [
      { day: 1, title: "Arrival in Dehradun & Drive to Mussoorie", description: "Pick up from Dehradun. Visit Robber's Cave, then drive to Mussoorie." },
      { day: 2, title: "Mussoorie Sightseeing", description: "Visit Kempty Falls, Gun Hill, and stroll along the Camel's Back Road." },
      { day: 3, title: "Dhanaulti Excursion", description: "Day trip to Dhanaulti. Visit the Eco Park and Surkanda Devi Temple." },
      { day: 4, title: "Departure", description: "Morning walk on the Mall Road. Transfer back to Dehradun." }
    ],
    inclusions: ["3 Nights Accommodation", "Breakfast & Dinner", "Private Cab for Transfers & Sightseeing"],
    exclusions: ["Flights/Train", "Cable Car Tickets", "Personal Expenses"]
  },
  {
    id: "pkg-7",
    title: "Shimla & Kufri Delight",
    location: "Himachal Pradesh, India",
    duration: "4 Days / 3 Nights",
    price: 13500,
    originalPrice: 17500,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1000",
    category: "Domestic",
    rating: 4.7,
    reviews: 156,
    description: "Discover the colonial architecture and snow-capped peaks of Shimla and Kufri.",
    itinerary: [
      { day: 1, title: "Arrival in Shimla", description: "Check-in to hotel. Evening free to explore the Mall Road and Ridge." },
      { day: 2, title: "Kufri Excursion", description: "Visit Kufri for snow activities and the Himalayan Nature Park." },
      { day: 3, title: "Local Sightseeing", description: "Visit Jakhu Temple, Viceregal Lodge, and Christ Church." },
      { day: 4, title: "Departure", description: "Check-out and transfer for your onward journey." }
    ],
    inclusions: ["3 Nights Accommodation", "Breakfast & Dinner", "Sightseeing by Private Cab"],
    exclusions: ["Flights/Train", "Activity Fees in Kufri", "Personal Expenses"]
  },
  {
    id: "pkg-8",
    title: "Sacred Char Dham Yatra",
    location: "Uttarakhand, India",
    duration: "10 Days / 9 Nights",
    price: 35000,
    originalPrice: 42000,
    image: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80&w=1000",
    category: "Spiritual",
    rating: 4.9,
    reviews: 420,
    description: "Embark on the ultimate spiritual journey to the four sacred shrines of Yamunotri, Gangotri, Kedarnath, and Badrinath nestled in the Himalayas.",
    itinerary: [
      { day: 1, title: "Haridwar to Barkot", description: "Drive to Barkot. En route visit Kempty Falls." },
      { day: 2, title: "Yamunotri Darshan", description: "Trek to Yamunotri, take a holy dip in Tapt Kund, and visit the temple." },
      { day: 3, title: "Barkot to Uttarkashi", description: "Drive to Uttarkashi. Visit Vishwanath Temple." },
      { day: 4, title: "Gangotri Darshan", description: "Drive to Gangotri, take a holy dip in the sacred river Ganges, and perform Pooja." },
      { day: 5, title: "Uttarkashi to Guptkashi", description: "Drive to Guptkashi. Evening at leisure." },
      { day: 6, title: "Kedarnath Darshan", description: "Trek to Kedarnath. Visit the majestic Kedarnath Temple." },
      { day: 7, title: "Kedarnath to Guptkashi", description: "Trek down and return to Guptkashi." },
      { day: 8, title: "Guptkashi to Badrinath", description: "Drive to Badrinath via Joshimath. Evening Aarti at Badrinath Temple." },
      { day: 9, title: "Badrinath Darshan & Rudraprayag", description: "Holy bath in Tapt Kund, Badrinath Darshan, and drive to Rudraprayag." },
      { day: 10, title: "Rudraprayag to Haridwar", description: "Drive back to Haridwar. Tour concludes." }
    ],
    inclusions: ["9 Nights Accommodation", "Breakfast & Dinner", "Transfers by Private Vehicle", "Yatra Registration"],
    exclusions: ["Helicopter Tickets", "Pony/Palanquin charges", "Lunch", "Personal Expenses"]
  },
  {
    id: "pkg-9",
    title: "Divine Khatu Shyam Darshan",
    location: "Rajasthan, India",
    duration: "2 Days / 1 Night",
    price: 4500,
    originalPrice: 6000,
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=1000",
    category: "Spiritual",
    rating: 4.9,
    reviews: 315,
    description: "Experience the divine blessings of Khatu Shyam Ji in Sikar, Rajasthan. A perfect short spiritual getaway.",
    itinerary: [
      { day: 1, title: "Arrival in Jaipur & Drive to Khatu", description: "Arrive in Jaipur and drive to Khatu village. Evening Aarti at Khatu Shyam Temple." },
      { day: 2, title: "Morning Darshan & Departure", description: "Early morning Mangla Aarti. Drive back to Jaipur for your onward journey." }
    ],
    inclusions: ["1 Night Accommodation", "Breakfast", "Private Cab Transfers", "VIP Darshan Assistance"],
    exclusions: ["Flights/Train", "Lunch & Dinner", "Personal Expenses"]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Travel Enthusiast",
    content: "TripOnBudget made our trip to Rajasthan an absolute dream! The booking process was seamless, and the price was unbeatable.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Frequent Traveler",
    content: "I've booked three trips with them so far. Their domestic packages are incredibly well-planned and truly budget-friendly.",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Solo Backpacker",
    content: "The Ladakh expedition was amazing. The itinerary was perfectly balanced between adventure and relaxation. Highly recommend!",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Family Traveler",
    content: "We took the Kerala package for our family vacation. Everything from the houseboat to the food was arranged perfectly.",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 5,
    name: "Neha Gupta",
    role: "Weekend Explorer",
    content: "Their weekend getaways are a lifesaver for corporate employees like me. The Goa trip was exactly what I needed to unwind.",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 6,
    name: "Arjun Patel",
    role: "Photography Enthusiast",
    content: "The Spiti Valley tour gave me some of the best shots of my life. The guides knew exactly where to take us for the best views.",
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

export const categories = [
  { name: "Domestic", icon: "MapPin", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=500" },
  { name: "Adventure", icon: "Mountain", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500" },
  { name: "Spiritual", icon: "Sun", image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=500" },
  { name: "Weekend trips", icon: "Calendar", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=500" },
  { name: "Heritage", icon: "Castle", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=500" }
];

export const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Traveling on a Budget in Europe",
    excerpt: "Europe doesn't have to be expensive. Discover how to explore the continent without breaking the bank.",
    content: "Traveling to Europe is a dream for many, but the perceived cost often deters people. However, with careful planning and a few smart strategies, you can explore this beautiful continent without emptying your savings account.\n\n1. Travel Off-Season: Summer is the most expensive time to visit Europe. Consider traveling in the shoulder seasons (spring or fall) or even winter. Flights and accommodation are significantly cheaper, and you'll avoid the massive crowds.\n\n2. Embrace Public Transportation: Europe has an incredible network of trains and buses. Instead of taking expensive flights between cities, look into Eurail passes or budget bus companies like FlixBus.\n\n3. Stay in Hostels or Alternative Accommodation: Hotels can eat up a large portion of your budget. Hostels are not only cheap but also great places to meet fellow travelers. Alternatively, consider renting a room on Airbnb or trying couchsurfing.\n\n4. Cook Your Own Meals: Eating out for every meal will quickly drain your funds. Book accommodation with a kitchen and visit local supermarkets or farmers' markets. It's a fun way to experience the local culture while saving money.\n\n5. Take Advantage of Free Attractions: Many European cities offer free walking tours (remember to tip your guide!). Additionally, many world-class museums have free entry days or discounted rates for students and youths.\n\n6. Use Budget Airlines Wisely: Airlines like Ryanair and EasyJet offer incredibly cheap flights, but beware of hidden fees. Always read the fine print regarding luggage allowances and check-in procedures.\n\n7. Walk Everywhere: The best way to see a European city is on foot. It's free, healthy, and allows you to stumble upon hidden gems you might otherwise miss.\n\n8. Get a City Tourist Card: If you plan on visiting many paid attractions and using public transport frequently, a city card can offer significant savings.\n\n9. Avoid Tourist Traps for Dining: Restaurants located right next to major attractions are usually overpriced and offer lower quality food. Walk a few streets away to find where the locals eat.\n\n10. Be Flexible: Sometimes the best deals are found when you're open to different destinations or travel dates. Use flight search engines with flexible date options to find the cheapest flights.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000",
    date: "Oct 15, 2023",
    author: "Sarah Jenkins",
    category: "Budget Travel"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Backpacking Southeast Asia",
    excerpt: "Everything you need to know before embarking on a backpacking adventure through Thailand, Vietnam, and Bali.",
    content: "Southeast Asia is a backpacker's paradise. With its stunning landscapes, rich cultures, delicious food, and incredibly low cost of living, it's the perfect destination for a long-term adventure. Here is your ultimate guide to backpacking through this amazing region.\n\nPlanning Your Route:\nWhile it's tempting to try and see everything, Southeast Asia is vast. A common and popular route is the 'Banana Pancake Trail,' which typically includes Thailand, Laos, Vietnam, and Cambodia. If you have more time, consider adding Indonesia (Bali) or the Philippines.\n\nVisas:\nVisa requirements vary greatly depending on your nationality and the country you're visiting. Some countries offer visa-free entry or visa-on-arrival, while others require you to apply in advance. Always check the official government websites well before your trip.\n\nBudgeting:\nOne of the biggest draws of Southeast Asia is its affordability. You can comfortably travel on $30-$50 USD a day, depending on your travel style. This budget covers hostel dorms, street food, local transportation, and some activities.\n\nAccommodation:\nHostels are everywhere and are incredibly cheap. They range from basic dorms to luxurious 'flashpacker' hostels with pools and co-working spaces. Guesthouses are another great, affordable option, especially if you're traveling with a partner.\n\nFood:\nThe street food in Southeast Asia is legendary. It's cheap, delicious, and generally safe if you eat at busy stalls where the food is cooked fresh in front of you. Don't miss Pad Thai in Thailand, Pho in Vietnam, and Nasi Goreng in Indonesia.\n\nTransportation:\nGetting around is relatively easy. For long distances, budget airlines like AirAsia are fantastic. For shorter trips, overnight buses and trains are popular and save you a night's accommodation cost. Within cities, use ride-hailing apps like Grab or negotiate with tuk-tuk drivers.\n\nHealth and Safety:\nConsult your doctor about necessary vaccinations before you go. Always drink bottled or filtered water, and use mosquito repellent to protect against dengue fever and malaria. While generally safe, be aware of common scams and keep an eye on your belongings.\n\nWhat to Pack:\nPack light! The weather is hot and humid year-round. Bring lightweight, breathable clothing. Don't forget a universal adapter, a good quality power bank, a microfiber towel, and a basic first-aid kit.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000",
    date: "Sep 28, 2023",
    author: "Mike Chen",
    category: "Travel Guides"
  },
  {
    id: 3,
    title: "How to Find Cheap Flights: A Step-by-Step Guide",
    excerpt: "Stop overpaying for airfare. Learn the secrets to finding the best flight deals online.",
    content: "Finding cheap flights can feel like a dark art, but it's really about knowing where to look and being flexible. Here is a step-by-step guide to scoring the best airfare deals.\n\nStep 1: Be Flexible with Your Dates and Destinations\nThis is the golden rule of cheap flights. If you are dead-set on flying to Paris on a specific Friday in July, you will pay a premium. Use tools like Skyscanner's 'Everywhere' feature or Google Flights' 'Explore' map to find the cheapest places to fly on your available dates.\n\nStep 2: Use the Right Search Engines\nDon't rely on just one search engine. Skyscanner, Google Flights, and Momondo are generally considered the best. They search across hundreds of airlines, including budget carriers that some other sites miss.\n\nStep 3: Book at the Right Time\nThe old myth that booking on a Tuesday is cheapest isn't really true anymore. However, booking too early or too late will cost you. Generally, the sweet spot for domestic flights is 1-3 months in advance, and for international flights, it's 2-8 months in advance.\n\nStep 4: Consider Budget Airlines\nBudget airlines can offer incredible deals, but you must be aware of their business model. They charge for everything extra: checked bags, carry-on bags, seat selection, and even printing your boarding pass. Calculate the total cost before booking to ensure it's actually a deal.\n\nStep 5: Look for Error Fares\nSometimes airlines make mistakes and price a flight significantly lower than intended. These are called error fares. Websites like Secret Flying or Scott's Cheap Flights (now Going) specialize in finding these deals. You have to act fast, as they usually disappear quickly.\n\nStep 6: Use Points and Miles\nIf you travel frequently, sign up for airline loyalty programs and consider getting a travel rewards credit card. Accumulating points and miles can lead to free or heavily discounted flights.\n\nStep 7: Clear Your Cookies (Maybe)\nThere's a persistent rumor that airlines track your searches and raise prices if you check the same route repeatedly. While the evidence is mixed, it doesn't hurt to search in an incognito window or clear your cookies just in case.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    date: "Sep 10, 2023",
    author: "Priya Sharma",
    category: "Tips & Tricks"
  },
  {
    id: 4,
    title: "Hidden Gems in India You Must Visit",
    excerpt: "Skip the crowded tourist spots and explore these beautiful, lesser-known destinations in India.",
    content: "India is a vast and diverse country, and while places like the Taj Mahal and Goa are incredible, they can also be overwhelmingly crowded. If you're looking for a more authentic and peaceful experience, consider visiting these hidden gems.\n\n1. Spiti Valley, Himachal Pradesh\nOften overshadowed by its neighbor Ladakh, Spiti Valley offers similarly breathtaking landscapes with a fraction of the tourists. It's a high-altitude desert characterized by barren mountains, ancient monasteries (like Key Monastery), and pristine lakes. The journey there is an adventure in itself.\n\n2. Majuli, Assam\nMajuli is the world's largest river island, located in the Brahmaputra River. It's a cultural hub of Assamese neo-Vaishnavite culture, known for its satras (monasteries), vibrant festivals, and unique mask-making traditions. The island's serene environment is perfect for a relaxing getaway.\n\n3. Ziro Valley, Arunachal Pradesh\nFamous for the Ziro Music Festival, this valley is beautiful year-round. It's home to the Apatani tribe, known for their unique agricultural practices and facial tattoos. The lush green pine-clad hills and rice fields make it a photographer's dream.\n\n4. Gokarna, Karnataka\nIf you want the beautiful beaches of Goa without the commercialization and crowds, head to Gokarna. It's a temple town with stunning, laid-back beaches like Om Beach, Half Moon Beach, and Paradise Beach. It's ideal for a quiet, relaxing beach vacation.\n\n5. Chettinad, Tamil Nadu\nChettinad is a region known for its unique cuisine, distinct architecture, and rich cultural heritage. Explore the massive, intricately carved mansions built by the Chettiar merchants, and indulge in the fiery and flavorful local dishes.\n\n6. Khajjiar, Himachal Pradesh\nOften referred to as the 'Mini Switzerland of India,' Khajjiar is a picturesque hill station surrounded by dense pine and deodar forests. The central meadow with its small lake is incredibly scenic, offering a peaceful retreat from the bustling cities.\n\n7. Tawang, Arunachal Pradesh\nLocated near the border with Bhutan and Tibet, Tawang is famous for the Tawang Monastery, the largest monastery in India. The town is surrounded by glacial lakes, snow-capped peaks, and beautiful valleys, offering a deeply spiritual and visually stunning experience.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
    date: "Aug 22, 2023",
    author: "Rahul Verma",
    category: "Destinations"
  },
  {
    id: 5,
    title: "Packing Light: The Minimalist Travel Guide",
    excerpt: "Learn how to pack everything you need in a single carry-on bag for a month-long trip.",
    content: "Traveling with just a carry-on bag is liberating. You avoid baggage fees, skip the wait at the luggage carousel, and can easily navigate crowded streets and public transport. Here's how to master the art of minimalist packing.\n\n1. Choose the Right Bag\nInvest in a high-quality, lightweight carry-on backpack or suitcase that meets the size restrictions of most airlines. A bag with good compartments will help keep you organized.\n\n2. The Rule of Three\nWhen it comes to clothing, follow the rule of three: one to wear, one to wash, and one to dry. This applies to t-shirts, underwear, and socks. You don't need a different outfit for every day of your trip.\n\n3. Stick to a Color Palette\nPack clothes in neutral colors (black, white, gray, navy) that can be easily mixed and matched. This allows you to create multiple outfits from a few key pieces.\n\n4. Layering is Key\nInstead of packing bulky sweaters or heavy jackets, pack lightweight layers. A base layer, a mid-layer (like a fleece or light sweater), and a lightweight waterproof outer shell will keep you warm in various climates.\n\n5. Limit Your Shoes\nShoes take up the most space and weight. Try to travel with only two pairs: a comfortable pair of walking shoes (which you wear on the plane) and a pair of versatile sandals or nicer shoes, depending on your destination.\n\n6. Embrace Solid Toiletries\nLiquid restrictions are the bane of carry-on travelers. Switch to solid toiletries: solid shampoo and conditioner bars, bar soap, and solid deodorant. They last longer, don't leak, and don't count towards your liquid allowance.\n\n7. Do Laundry on the Road\nThis is the secret to long-term minimalist travel. You can wash your clothes in the sink using travel detergent or use local laundromats. It takes a little extra effort but saves a massive amount of space.\n\n8. Use Packing Cubes\nPacking cubes are essential for keeping your bag organized and compressing your clothes. They make it easy to find what you need without unpacking your entire bag.\n\n9. Digitize Everything\nDon't carry heavy guidebooks or stacks of paper documents. Download maps, guidebooks, and boarding passes to your phone or tablet. Use a Kindle or e-reader instead of physical books.\n\n10. Be Ruthless\nBefore you pack, lay everything out on your bed. Then, take away half of it. You need less than you think. If you truly forget something essential, you can almost certainly buy it at your destination.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000",
    date: "Aug 05, 2023",
    author: "Emma Watson",
    category: "Packing"
  },
  {
    id: 6,
    title: "Best Street Food Destinations Around the World",
    excerpt: "A culinary journey through the world's best street food markets and stalls.",
    content: "For many travelers, the best way to experience a new culture is through its food, and there's no better place to find authentic, affordable, and delicious local cuisine than on the street. Here are some of the best street food destinations in the world.\n\n1. Bangkok, Thailand\nBangkok is often considered the street food capital of the world. From the bustling stalls of Chinatown (Yaowarat) to the markets of Sukhumvit, you can find incredible dishes at any hour. Must-tries include Pad Thai, Som Tum (papaya salad), Moo Ping (grilled pork skewers), and Mango Sticky Rice.\n\n2. Penang, Malaysia\nGeorge Town in Penang is a melting pot of Malay, Chinese, and Indian cultures, and its street food reflects this incredible diversity. Head to Gurney Drive or Chulia Street for iconic dishes like Char Kway Teow (stir-fried rice noodles), Assam Laksa (sour fish noodle soup), and Nasi Kandar.\n\n3. Mexico City, Mexico\nMexican street food is vibrant, flavorful, and deeply rooted in tradition. Tacos are the star here—try Tacos al Pastor (spit-grilled pork) or Tacos de Suadero. Don't miss out on Tamales, Elotes (grilled corn), and Churros for dessert.\n\n4. Marrakech, Morocco\nAs the sun sets, the Jemaa el-Fnaa square in Marrakech transforms into a massive open-air dining area. The sights, sounds, and smells are intoxicating. Try the Tagine, Couscous, grilled meats, and the famous Moroccan mint tea.\n\n5. Ho Chi Minh City, Vietnam\nVietnamese street food is fresh, aromatic, and incredibly cheap. Pull up a tiny plastic stool on the sidewalk and enjoy a steaming bowl of Pho, a crispy Banh Mi sandwich, or Banh Xeo (savory crepes). Don't forget to try the strong, sweet Vietnamese iced coffee.\n\n6. Istanbul, Turkey\nIstanbul's street food is a delicious bridge between Europe and Asia. Grab a Simit (sesame-crusted bread ring) for breakfast, enjoy a Balik Ekmek (fish sandwich) by the Bosphorus, and indulge in Doner Kebab or Kumpir (stuffed baked potato) for dinner.\n\n7. Osaka, Japan\nKnown as 'Japan's Kitchen,' Osaka takes its food very seriously. The Dotonbori district is the epicenter of the street food scene. You must try Takoyaki (octopus balls), Okonomiyaki (savory pancakes), and Kushikatsu (deep-fried skewered meat and vegetables).",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000",
    date: "Jul 18, 2023",
    author: "David Lee",
    category: "Food & Culture"
  }
];
