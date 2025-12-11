const OpenAI = require('openai');
const axios = require('axios');

// Initialize AI client based on provider
let aiClient = null;

const initializeAI = () => {
  const provider = process.env.AI_PROVIDER || 'openai';
  
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    aiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  return provider;
};

// Comprehensive knowledge base about NexSpark
const NEXSPARK_KNOWLEDGE = {
  vehicleTypes: {
    suv: { examples: 'Toyota Fortuner, Mahindra XUV700, Hyundai Creta, Kia Seltos, Tata Harrier', priceRange: '₹3,200-5,500/day', features: 'Spacious, 6-7 seaters, ideal for families and long trips' },
    sedan: { examples: 'Honda City, Hyundai Verna, Maruti Ciaz, Skoda Octavia, Toyota Camry', priceRange: '₹2,200-4,000/day', features: 'Comfortable, 4-5 seaters, good fuel economy' },
    hatchback: { examples: 'Maruti Swift, Hyundai i20, Tata Altroz, Honda Jazz', priceRange: '₹1,500-1,800/day', features: 'Compact, economical, easy to park, city-friendly' },
    luxury: { examples: 'Mercedes E-Class, BMW 5 Series, Audi A6, Jaguar XF, Volvo S90', priceRange: '₹7,000-8,500/day', features: 'Premium comfort, advanced features, executive travel' },
    muv: { examples: 'Toyota Innova Crysta, Maruti Ertiga, Kia Carens, Mahindra Marazzo', priceRange: '₹2,000-3,800/day', features: '7-8 seaters, perfect for groups and families' },
    electric: { examples: 'Tata Nexon EV, MG ZS EV, Hyundai Kona Electric, Tesla Model 3', priceRange: '₹3,500-9,000/day', features: 'Zero emissions, low running cost, modern technology' },
    truck: { examples: 'Isuzu D-Max, Mahindra Bolero Pickup, Tata Xenon, Ford Ranger, Toyota Hilux', priceRange: '₹3,000-5,500/day', features: 'Heavy duty, cargo transport, commercial use' }
  },
  
  locations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Mumbai', 'Delhi', 'Bangalore'],
  
  bookingProcess: [
    '1. Search: Use the search feature to find vehicles by location and dates',
    '2. Browse: View available vehicles matching your criteria',
    '3. Select: Click "Book Now" on your preferred vehicle',
    '4. Enter Dates: Specify pickup and return dates',
    '5. Review: Check total cost and booking details',
    '6. Confirm: Complete the booking (requires login)',
    '7. Payment: Securely pay for your rental',
    '8. Confirmation: Receive booking confirmation and details'
  ],
  
  features: [
    'Real-time availability checking',
    'Secure online payment processing',
    'Multiple vehicle categories',
    'Flexible rental durations',
    'Instant booking confirmation',
    'WebSocket-based live updates',
    'My Bookings dashboard',
    'Notification system',
    'Multiple pickup locations'
  ],
  
  requirements: [
    'Valid driver\'s license',
    'Registered account on NexSpark',
    'Age requirement: 21+ years (may vary by vehicle type)',
    'Payment method (credit/debit card)',
    'Valid ID proof'
  ],
  
  policies: {
    cancellation: 'You can cancel bookings through "My Bookings" section. For refunds and modification details, please contact support.',
    payment: 'We accept major credit/debit cards. Payment is processed securely after booking confirmation.',
    fuel: 'Vehicles should be returned with the same fuel level as pickup.',
    insurance: 'Basic insurance is included. Additional coverage options available.',
    duration: 'Minimum rental: 1 day. Daily rates apply. Weekly and monthly rates available for longer rentals.'
  }
};

// Enhanced system prompt with accurate NexSpark knowledge
const SYSTEM_PROMPT = `You are NexSpark AI Assistant, a highly knowledgeable and accurate virtual assistant for NexSpark Vehicle Rental platform.

Your PRIMARY GOALS:
1. Provide PRECISE, ACCURATE information (never guess or make up details)
2. Understand user intent and provide RELEVANT responses
3. Give SPECIFIC recommendations based on user needs
4. Guide users through the platform effectively

## VEHICLE CATEGORIES (Use EXACT prices and models):

**SUVs** ($150-180/day | ₹3,200-5,500/day)
- Models: Toyota Fortuner, Mahindra XUV700, Hyundai Creta, Kia Seltos, Tata Harrier, BMW X5, Mercedes GLE
- Capacity: 6-7 passengers
- Features: Spacious luggage, all-terrain capability, family-friendly
- Best for: Long trips, mountain drives, families with children, luxury travel

**Sedans** ($80-120/day | ₹2,200-4,000/day)  
- Models: Honda City, Hyundai Verna, Maruti Ciaz, Skoda Octavia, Toyota Camry, Audi A7, Mercedes E-Class
- Capacity: 4-5 passengers
- Features: Comfortable seating, good fuel economy, professional appearance
- Best for: Business travel, airport transfers, comfortable city drives

**Hatchbacks** ($50-60/day | ₹1,500-1,800/day)
- Models: Maruti Swift, Hyundai i20, Tata Altroz, Honda Jazz, Ford Figo
- Capacity: 4-5 passengers
- Features: Compact, easy parking, excellent fuel economy, affordable
- Best for: City commuting, short trips, budget travel, solo/couple travel

**Luxury** ($200-280/day | ₹7,000-8,500/day)
- Models: Mercedes E-Class, BMW 5 Series, Audi A6, Jaguar XF, Volvo S90, Porsche 911
- Capacity: 4-5 passengers
- Features: Premium interiors, advanced technology, superior comfort, status symbol
- Best for: Executive meetings, special occasions, VIP travel, weddings

**MUVs/Vans** ($70-130/day | ₹2,000-3,800/day)
- Models: Toyota Innova Crysta, Maruti Ertiga, Kia Carens, Mahindra Marazzo, Mercedes-Benz Vito
- Capacity: 7-8 passengers
- Features: Multiple seating rows, flexible configuration, family-friendly
- Best for: Large families, group outings, airport shuttles for groups

**Electric Vehicles** ($120-300/day | ₹3,500-9,000/day)
- Models: Tata Nexon EV, MG ZS EV, Hyundai Kona Electric, Tesla Model 3, BMW i4
- Capacity: 4-5 passengers
- Features: Zero emissions, instant torque, low operating costs, modern tech
- Best for: Eco-conscious travelers, city driving, tech enthusiasts

**Trucks/Pickups** ($100-180/day | ₹3,000-5,500/day)
- Models: Isuzu D-Max, Mahindra Bolero Pickup, Tata Xenon, Ford Ranger, Toyota Hilux
- Capacity: 2-5 passengers + cargo bed
- Features: High payload capacity, rugged build, off-road capability
- Best for: Moving/transport, commercial use, construction sites, adventure trips

## AVAILABLE LOCATIONS:
**USA**: New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose
**India**: Mumbai, Delhi, Bangalore

## BOOKING PROCESS (Explain clearly when asked):
1. **Search**: Click search icon/button → Enter location and rental dates → Click "Search"
2. **Browse**: View list of available vehicles with images, specs, and prices
3. **Select**: Click "Book Now" on your preferred vehicle
4. **Login**: You must be logged in (create account if new user)
5. **Confirm Details**: Verify pickup/return dates and location
6. **Review Cost**: Check total = (daily rate × number of days)
7. **Payment**: Enter card details → Secure payment processing
8. **Confirmation**: Receive booking ID, confirmation email, and pickup instructions

## KEY POLICIES & INFO:
- **Minimum Age**: 21 years (23+ for luxury/trucks)
- **Required Documents**: Valid driver's license, ID proof, credit/debit card
- **Fuel Policy**: Return with same fuel level as pickup (or pay refueling charge)
- **Insurance**: Basic coverage included; additional comprehensive coverage available
- **Mileage**: Unlimited mileage on most rentals
- **Cancellation**: View/cancel bookings in "My Bookings" section. Refund policy varies by timing
- **Modifications**: Contact support to modify dates/vehicles
- **Late Returns**: Additional charges apply (usually 1-hour grace period)
- **Damage**: Report immediately; covered by insurance (excess may apply)

## INTELLIGENT RECOMMENDATION LOGIC:

**When user mentions NUMBER OF PEOPLE:**
- 1-2 people: Hatchback (budget) or Sedan (comfort)
- 3-4 people: Sedan or SUV (if luggage heavy)
- 5-6 people: SUV or MUV
- 7+ people: MUV only

**When user mentions BUDGET:**
- "Cheap/Budget": Hatchback ($50-60/day)
- "Mid-range": Sedan ($80-120/day)
- "Comfortable": SUV ($150-180/day)
- "Premium/Luxury": Luxury cars ($200-280/day)

**When user mentions TRIP TYPE:**
- City/Short trip: Hatchback or Sedan
- Long trip/Highway: SUV or Sedan
- Mountain/Off-road: SUV or Truck
- Business/Professional: Sedan or Luxury
- Family vacation: SUV or MUV
- Eco-conscious: Electric vehicles
- Moving/Cargo: Truck/Pickup

**When user mentions FEATURES:**
- "Spacious/Luggage": SUV, MUV
- "Fuel efficient": Hatchback, Electric
- "Comfortable": Sedan, Luxury
- "Tech/Modern": Electric, Luxury
- "Rugged/Tough": Truck, SUV

## YOUR LIMITATIONS (Be honest about these):
- You CANNOT make actual bookings (direct users to website)
- You CANNOT access user's personal data or current bookings
- You CANNOT process payments or refunds
- You CANNOT check real-time availability (direct to search)
- You CANNOT modify existing bookings (direct to support)
- You CAN provide information, recommendations, and guidance

## RESPONSE RULES:
1. **Accuracy First**: Never make up prices or models. Use only information provided above.
2. **Be Specific**: Give exact models and prices, not vague ranges.
3. **Ask Clarifying Questions**: If user needs recommendation, ask about passengers/budget/trip type.
4. **Action-Oriented**: Always tell users WHAT TO DO NEXT (e.g., "Use the search feature...", "Click Book Now...")
5. **Concise**: 2-4 sentences ideal. Use bullet points for lists.
6. **Context-Aware**: Remember conversation history and build on it.
7. **Handle Variations**: Understand different ways users ask the same question (e.g., "rent", "hire", "book" all mean the same)

## EXAMPLE CONVERSATIONS:

User: "I need a car for 5 people for a weekend trip"
You: "For 5 people, I recommend an **SUV** like the Hyundai Creta or Kia Seltos ($150-160/day). They offer comfortable seating for 5, plenty of luggage space for a weekend, and are great for highway driving. For a 2-day weekend, total cost would be around $300-320. Use the search feature to check availability! 🚗"

User: "What's the cheapest car?"
You: "Our most affordable option is a **Hatchback** at $50-60/day (₹1,500-1,800/day). Models include Maruti Swift, Hyundai i20, and Tata Altroz. Perfect for city driving, seats 4-5 people comfortably, and has excellent fuel economy! 💰"

User: "BMW available?"
You: "Yes! We have **BMW** models in our Luxury and SUV categories:\n• BMW 5 Series (Luxury Sedan): $230/day\n• BMW X5 (Luxury SUV): $250/day\n• BMW i4 (Electric Sedan): $220/day\nAll include premium features and insurance. Search your location to check availability! ✨"

User: "How to book?"
You: "**Simple 4-step booking:**\n1. Search → Enter your location and dates\n2. Choose → Click 'Book Now' on your preferred vehicle\n3. Login → Sign in or create account\n4. Pay → Complete secure payment and get instant confirmation\nTakes less than 5 minutes! Ready to start? 📋"

Tone: Professional yet friendly, confident, helpful. Use 1-2 emojis per response. Be conversational but accurate.`;

// Chat with OpenAI
const chatWithOpenAI = async (userMessage, conversationHistory = []) => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await aiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.4, // Lower for more accurate, focused responses
      max_tokens: 500,
      top_p: 0.85,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.3, // Encourage diverse vocabulary
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error('Failed to get response from AI');
  }
};

// Chat with Google Gemini
const chatWithGemini = async (userMessage, conversationHistory = []) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-pro';
    
    // Build conversation context with last 10 messages
    let context = SYSTEM_PROMPT + '\n\n';
    conversationHistory.slice(-10).forEach(msg => {
      context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    context += `User: ${userMessage}\nAssistant:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: context
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.9,
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error('Failed to get response from AI');
  }
};

// Chat with local model (e.g., Ollama)
const chatWithLocalModel = async (userMessage, conversationHistory = []) => {
  try {
    const modelUrl = process.env.LOCAL_MODEL_URL;
    const modelName = process.env.LOCAL_MODEL_NAME || 'llama2';
    
    // Build conversation context with last 10 messages
    let context = SYSTEM_PROMPT + '\n\n';
    conversationHistory.slice(-10).forEach(msg => {
      context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    context += `User: ${userMessage}\nAssistant:`;

    const response = await axios.post(modelUrl, {
      model: modelName,
      prompt: context,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 400,
      }
    });

    return response.data.response;
  } catch (error) {
    console.error('Local Model Error:', error.message);
    throw new Error('Failed to get response from local model');
  }
};

// Enhanced fallback responses with intelligent pattern matching
const getFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Specific vehicle model inquiries
  if (message.includes('bmw')) {
    return "**BMW vehicles available:**\n• BMW 5 Series (Luxury Sedan): $230/day - Executive comfort\n• BMW X5 (Luxury SUV): $250/day - Premium family SUV\n• BMW i4 (Electric): $220/day - Electric performance sedan\n\nAll include full insurance and premium features. Use search to check availability in your city! 🚗";
  }
  
  if (message.includes('mercedes') || message.includes('benz')) {
    return "**Mercedes-Benz options:**\n• Mercedes E-Class (Luxury Sedan): $240/day\n• Mercedes GLE (Luxury SUV): $270/day\n• Mercedes Vito (Van): $140/day\n\nPremium German engineering with advanced safety features. Search your location for availability! ✨";
  }
  
  if (message.includes('audi')) {
    return "**Audi vehicles:**\n• Audi A6 (Luxury Sedan): $235/day - Business class comfort\n• Audi A7 (Sedan): $130/day - Stylish performance\n\nFeatures: Quattro AWD, premium interiors, advanced tech. Check availability now! 🚙";
  }
  
  if (message.includes('tesla')) {
    return "**Tesla Model 3** available for $250-300/day! Features:\n• Fully electric (zero emissions)\n• Autopilot capability\n• Long-range battery\n• Premium interior\n\nPerfect for tech enthusiasts and eco-conscious travelers. Search to check availability! ⚡";
  }
  
  if (message.includes('porsche')) {
    return "**Porsche 911** available in our luxury fleet at $280/day! Iconic sports car with legendary performance. Perfect for special occasions and unforgettable driving experiences. Use search to check availability! 🏎️";
  }
  
  // Vehicle type inquiries with better context
  if (message.includes('suv')) {
    if (message.includes('luxury') || message.includes('premium')) {
      return "**Luxury SUVs:**\n• BMW X5: $250/day - 7-seater, premium German SUV\n• Mercedes GLE: $270/day - Comfort and technology\n• Regular SUVs (Hyundai Creta, Kia Seltos): $150-160/day\n\nWhich fits your needs? 🚗";
    }
    return "**SUVs available** ($150-180/day):\n• Hyundai Creta: $155/day - Popular choice, 5-7 seats\n• Kia Seltos: $160/day - Modern features, spacious\n• Toyota Fortuner: $175/day - Rugged, 7-seater\n• Mahindra XUV700: $165/day - Tech-loaded, comfortable\n\nPerfect for families and long trips! Use search to book. 🚙";
  }
  
  if (message.includes('sedan')) {
    if (message.includes('luxury') || message.includes('executive')) {
      return "**Luxury Sedans** ($200-240/day):\n• Mercedes E-Class: $240/day\n• BMW 5 Series: $230/day\n• Audi A6: $235/day\n\nPremium interiors, advanced features, perfect for business travel. Search now! ✨";
    }
    return "**Sedans** ($80-120/day):\n• Honda City: $90/day - Reliable, comfortable\n• Hyundai Verna: $95/day - Feature-rich\n• Toyota Camry: $115/day - Premium comfort\n• Maruti Ciaz: $85/day - Spacious, economical\n\nIdeal for business and comfortable city drives. Book now! 🚗";
  }
  
  if (message.includes('hatchback') || message.includes('small car')) {
    return "**Hatchbacks** ($50-60/day) - Most affordable!\n• Maruti Swift: $50/day - Best seller, reliable\n• Hyundai i20: $55/day - Premium features\n• Tata Altroz: $55/day - Safest hatchback\n• Honda Jazz: $58/day - Spacious interior\n\nPerfect for city driving, 4-5 passengers. Great fuel economy! 💰";
  }
  
  if (message.includes('luxury') || message.includes('premium')) {
    return "**Luxury Vehicles** ($200-280/day):\n**Sedans:**\n• Mercedes E-Class: $240/day\n• BMW 5 Series: $230/day\n• Audi A6: $235/day\n**SUVs:**\n• BMW X5: $250/day\n• Mercedes GLE: $270/day\n**Sports:**\n• Porsche 911: $280/day\n\nAll include premium insurance and concierge service. Search to book! ✨";
  }
  
  if (message.includes('electric') || message.includes('ev') || message.includes('eco')) {
    return "**Electric Vehicles** ($120-300/day):\n• Tata Nexon EV: $120/day - Affordable, 300km range\n• MG ZS EV: $140/day - SUV style, 400km range\n• Hyundai Kona Electric: $160/day - Premium features\n• Tesla Model 3: $280/day - Autopilot, 500km range\n• BMW i4: $220/day - Luxury electric sedan\n\nZero emissions, low cost per km, instant torque! 🔋";
  }
  
  if (message.includes('muv') || message.includes('van') || message.includes('7 seat') || message.includes('8 seat')) {
    return "**MUVs/Vans** ($70-140/day) for groups:\n• Toyota Innova Crysta: $125/day - 7-8 seats, most comfortable\n• Kia Carens: $95/day - 7 seats, modern features\n• Maruti Ertiga: $75/day - 7 seats, budget-friendly\n• Mercedes Vito: $140/day - 8 seats, luxury van\n\nPerfect for family trips and group outings! 👨‍👩‍👧‍👦";
  }
  
  if (message.includes('truck') || message.includes('pickup')) {
    return "**Trucks/Pickups** ($100-180/day):\n• Toyota Hilux: $175/day - Legendary reliability\n• Ford Ranger: $165/day - Powerful, modern\n• Isuzu D-Max: $145/day - Workhorse, reliable\n• Mahindra Bolero Pickup: $105/day - Budget option\n\nHigh payload capacity, rugged build. Ideal for moving, cargo, construction! 🚚";
  }
  
  // Intelligent passenger-based recommendations
  if (message.includes('family') || message.includes('kids') || message.includes('children')) {
    if (message.includes('large') || message.includes('big')) {
      return "**For large families (7+ people):**\n• Toyota Innova Crysta: $125/day - 8 seats, captain chairs\n• Kia Carens: $95/day - 7 seats, modern tech\n• Mercedes Vito: $140/day - 8 seats, luxury\n\nAll have ample luggage space and comfort features! 👨‍👩‍👧‍👦";
    }
    return "**For families:**\n• **5-6 people**: SUV (Hyundai Creta $155/day, Kia Seltos $160/day)\n• **7+ people**: MUV (Toyota Innova $125/day, Kia Carens $95/day)\n\nSUVs: More luggage space, safer for kids\nMUVs: More seating, flexible configuration\n\nWhich suits your family size? 🚗";
  }
  
  if ((message.includes('1') || message.includes('one') || message.includes('2') || message.includes('two') || message.includes('solo') || message.includes('couple')) && (message.includes('people') || message.includes('person'))) {
    return "**For 1-2 people:**\n• **Budget**: Hatchback (Maruti Swift $50/day, Hyundai i20 $55/day)\n• **Comfort**: Sedan (Honda City $90/day)\n• **Luxury**: BMW 5 Series ($230/day), Mercedes E-Class ($240/day)\n\nWhat's your budget and trip type (city/highway/business)? 🚗";
  }
  
  if ((message.includes('3') || message.includes('three') || message.includes('4') || message.includes('four')) && message.includes('people')) {
    return "**For 3-4 people:**\n• **Budget-friendly**: Hatchback (Maruti Swift $50/day) - Compact, economical\n• **Comfortable**: Sedan (Honda City $90/day, Hyundai Verna $95/day) - Spacious, AC\n• **Spacious luggage**: SUV (Hyundai Creta $155/day) - Extra boot space\n\nHow much luggage do you have? City or highway trip? 🚙";
  }
  
  if ((message.includes('5') || message.includes('five')) && message.includes('people')) {
    return "**For 5 people:**\n• **Economical**: Sedan (Honda City $90/day, Toyota Camry $115/day) - Fits 5 comfortably\n• **Spacious**: SUV (Hyundai Creta $155/day, Kia Seltos $160/day) - More luggage room\n• **Luxury**: BMW 5 Series ($230/day) - Premium comfort\n\nFor 2-day trip: Sedan ~$180, SUV ~$310. Heavy luggage? Go SUV! 🚗";
  }
  
  if ((message.includes('6') || message.includes('six') || message.includes('7') || message.includes('seven')) && message.includes('people')) {
    return "**For 6-7 people:**\n• **SUV** (if 6 people): Toyota Fortuner $175/day - 7 seats, spacious\n• **MUV** (7 people): Toyota Innova Crysta $125/day - 8 seats, captain chairs\n• **MUV**: Kia Carens $95/day - 7 seats, budget-friendly\n\nMUVs are specifically designed for 7+ passengers. SUVs better for 5-6. Choose based on exact count! 👨‍👩‍👧‍👦";
  }
  
  // Pricing inquiries with examples
  if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('how much')) {
    if (message.includes('cheap') || message.includes('budget') || message.includes('affordable')) {
      return "**Most affordable options:**\n• Maruti Swift (Hatchback): $50/day\n• Hyundai i20 (Hatchback): $55/day\n• Maruti Ertiga (MUV): $75/day\n\n**Example costs:**\n• 3-day weekend: $150-165 total\n• 7-day week: $350-385 total\n\nIncludes insurance and unlimited mileage! 💰";
    }
    return "**NexSpark Pricing (per day):**\n• **Hatchbacks**: $50-60 (₹1,500-1,800)\n• **Sedans**: $80-120 (₹2,200-4,000)\n• **SUVs**: $150-180 (₹3,200-5,500)\n• **MUVs**: $70-130 (₹2,000-3,800)\n• **Luxury**: $200-280 (₹7,000-8,500)\n• **Electric**: $120-300 (₹3,500-9,000)\n• **Trucks**: $100-180 (₹3,000-5,500)\n\n**Total = Daily rate × Days**\nExample: SUV ($155/day) × 5 days = $775\n\nIncludes insurance! Search for exact prices. 💳";
  }
  
  // Detailed booking process
  if (message.includes('book') || message.includes('rent') || message.includes('reserve') || message.includes('hire')) {
    if (message.includes('how') || message.includes('process') || message.includes('step')) {
      return "**Complete booking process:**\n\n1️⃣ **Search**: Click search icon → Enter location + dates → Click 'Search'\n2️⃣ **Browse**: View available vehicles with photos, specs, prices\n3️⃣ **Select**: Click 'Book Now' on your preferred vehicle\n4️⃣ **Login**: Sign in (or create account if new)\n5️⃣ **Confirm**: Verify dates, location, and review total cost\n6️⃣ **Payment**: Enter card details → Secure processing\n7️⃣ **Done**: Get booking ID, confirmation email, pickup instructions\n\nTakes 3-5 minutes! Ready to start? 📋";
    }
    return "**Quick booking steps:**\n1. Search (location + dates) → 2. Choose vehicle → 3. Login → 4. Pay\n\nYou'll need: Valid driver's license (age 21+), credit/debit card, and an account. Get instant confirmation and pickup details. Start searching now! 🚗";
  }
  
  if (message.includes('how') && (message.includes('work') || message.includes('use') || message.includes('platform'))) {
    return "**How NexSpark works:**\n\n1. **Create Account** → Free registration with email\n2. **Search** → Enter location (10+ cities), pick dates\n3. **Browse** → See 100+ vehicles (photos, specs, reviews)\n4. **Compare** → Check prices, features, availability\n5. **Book** → Click 'Book Now', confirm details\n6. **Pay** → Secure card payment (instant confirmation)\n7. **Receive** → Get booking ID, pickup location, instructions\n8. **Pick Up** → Show ID + license at location\n9. **Drive** → Enjoy your rental!\n10. **Return** → Drop at same/different location\n\nSimple, secure, fast! Create account to start. 🚗";
  }
  
  if (message.includes('start') || message.includes('begin') || message.includes('get started')) {
    return "**Get started in 3 steps:**\n\n1. **Register** → Click 'Sign Up', enter email + password (takes 1 min)\n2. **Search** → Enter your city and travel dates\n3. **Book** → Choose vehicle and complete payment\n\n**You'll need:**\n✅ Valid email\n✅ Driver's license (age 21+)\n✅ Credit/debit card\n\nReady to register? Click 'Sign Up' in the top right! 🚀";
  }
  
  // Location inquiries with specificity
  if (message.includes('location') || message.includes('where') || message.includes('city') || message.includes('cities') || message.includes('available')) {
    if (message.match(/new york|nyc|ny\b/i)) {
      return "**New York locations:** Manhattan, Brooklyn, Queens, JFK Airport, LaGuardia Airport. Full range of vehicles from $50/day hatchbacks to $280/day luxury cars. Use search with 'New York' to see all available vehicles! 🗽";
    }
    if (message.match(/los angeles|la\b|california/i)) {
      return "**Los Angeles locations:** Downtown LA, Santa Monica, Beverly Hills, LAX Airport. Popular choices: SUVs for coastal drives, luxury cars for Hollywood style! Search 'Los Angeles' to book. 🌴";
    }
    if (message.match(/chicago/i)) {
      return "**Chicago locations:** Downtown (Loop), O'Hare Airport, Midway Airport. All vehicle types available. Sedans popular for business, SUVs for families. Search 'Chicago' now! 🏙️";
    }
    return "**NexSpark operates in 13+ cities:**\n\n**USA**: New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose\n\n**India**: Mumbai, Delhi, Bangalore\n\nVehicles available at airports, downtown, and major areas. Use the search feature and select your city to see all options! 📍";
  }
  
  // Payment inquiries with details
  if (message.includes('payment') || message.includes('pay') || message.includes('card') || message.includes('accept')) {
    if (message.includes('method') || message.includes('options') || message.includes('accept') || message.includes('type')) {
      return "**Accepted payment methods:**\n✅ Visa, Mastercard, American Express\n✅ Debit cards (with CVV)\n✅ All major credit cards\n\n**Payment process:**\n• Payment after booking confirmation\n• Secure SSL encryption\n• Instant receipt and confirmation\n• No hidden fees (price shown = final price)\n\n**Cost calculation:** Daily rate × Days. Example: $155/day × 3 days = $465 💳";
    }
    return "**Payment process:**\n1. Complete booking form\n2. Review total cost (Daily rate × Number of days)\n3. Enter card details (secure SSL encryption)\n4. Click 'Pay Now'\n5. Instant confirmation + receipt\n\nWe accept Visa, Mastercard, Amex, debit cards. All transactions are secure. No hidden fees! 💳";
  }
  
  // Cancellation/modification with policy details
  if (message.includes('cancel') || message.includes('modify') || message.includes('change') || message.includes('refund')) {
    if (message.includes('policy') || message.includes('how') || message.includes('process')) {
      return "**Cancellation & Modification:**\n\n**To Cancel:**\n1. Login → Go to 'My Bookings'\n2. Find your booking\n3. Click 'Cancel Booking'\n4. Confirm cancellation\n\n**To Modify:**\nContact support with booking ID for:\n• Date changes\n• Vehicle changes\n• Location changes\n\n**Refund Policy:**\n• Cancellation timing affects refund amount\n• Processed within 5-7 business days\n\nCheck 'My Bookings' to manage your reservations! 📋";
    }
    return "**Manage your bookings:**\n\n• Login → **'My Bookings'** section\n• View all current & past bookings\n• See status, dates, vehicle details\n• Cancel bookings directly\n\nFor modifications (dates/vehicle), contact support with booking ID. Refunds processed based on cancellation timing. 📋";
  }
  
  // Requirements with age/document details
  if (message.includes('require') || message.includes('need') || message.includes('document') || message.includes('license') || message.includes('age')) {
    if (message.includes('age') || message.includes('old') || message.includes('young')) {
      return "**Age requirements:**\n• **Standard cars** (Hatchback/Sedan/SUV/MUV): **21+ years**\n• **Luxury cars** (BMW, Mercedes, Audi): **23+ years**\n• **Trucks/Commercial**: **23+ years**\n• **Electric vehicles**: **21+ years**\n\nValid driver's license required (minimum 1 year). Upper age limit: None! 📄";
    }
    return "**Requirements to rent a vehicle:**\n\n✅ **Valid driver's license** (held for 1+ year)\n✅ **Age**: 21+ (23+ for luxury/trucks)\n✅ **NexSpark account** (free registration)\n✅ **Payment method** (credit/debit card)\n✅ **Government ID** (passport/national ID)\n\n**At pickup:**\n• Show license + ID\n• Verify booking details\n• Inspect vehicle\n• Sign rental agreement\n\nReady to book? 📄";
  }
  
  // Insurance inquiries
  if (message.includes('insurance') || message.includes('coverage') || message.includes('damage')) {
    return "**Insurance & Coverage:**\n\n✅ **Included FREE:**\n• Basic liability coverage\n• Third-party damage\n• Theft protection\n\n**Optional Add-ons:**\n• Comprehensive damage waiver ($10-15/day)\n• Zero excess coverage ($8-12/day)\n• Personal accident insurance ($5/day)\n\n**In case of damage:**\n1. Report immediately\n2. Document with photos\n3. File police report (if major)\n4. Insurance covers repair (excess may apply)\n\nBasic coverage is always included in the price! 🛡️";
  }
  
  // Fuel policy
  if (message.includes('fuel') || message.includes('gas') || message.includes('petrol') || message.includes('diesel')) {
    return "**Fuel policy:**\n\n📌 **Full-to-Full policy**:\n• Pick up with full tank\n• Return with full tank\n• Fair and transparent\n\n❌ **If returned not full:**\n• Refueling charge: $5-10 service fee\n• Fuel cost at premium rates\n• Better to refuel yourself before return!\n\n💡 **Tip:** Refuel at gas station near return location before drop-off. Save money and hassle! ⛽";
  }
  
  // Duration/rental period
  if (message.includes('duration') || message.includes('minimum') || message.includes('maximum') || message.includes('how long')) {
    return "**Rental duration:**\n\n• **Minimum**: 1 day (24 hours)\n• **Maximum**: No limit (rent for months!)\n• **Hourly rentals**: Not available currently\n\n**Pricing:**\n• Daily rate for 1-6 days\n• Weekly discounts for 7+ days\n• Monthly discounts for 30+ days\n\n**Example:**\n• 3 days: Regular rate ($155 × 3 = $465)\n• 7 days: ~10% discount\n• 30 days: ~20% discount\n\nLonger rentals = better value! 📅";
  }
  
  // Greeting with context
  if (message.includes('hello') || message.includes('hi ') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon') || message.includes('good evening')) {
    return "Hello! 👋 I'm your NexSpark AI Assistant. I provide **accurate, detailed** information about vehicle rentals.\n\n**I can help you with:**\n• 🚗 **Vehicle recommendations** (based on passengers, budget, trip)\n• 💰 **Accurate pricing** ($50-$280/day across all categories)\n• 📋 **Booking guidance** (step-by-step process)\n• 📍 **Location info** (13+ cities, airport pickups)\n• 📄 **Requirements** (license, age, documents)\n• ❓ **Policies** (fuel, insurance, cancellation)\n\n**Popular questions:**\n• \"I need a car for 5 people\"\n• \"What's the cheapest option?\"\n• \"How do I book?\"\n• \"BMW available?\"\n\nWhat would you like to know? 🚗";
  }
  
  // Thanks/appreciation
  if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
    return "You're welcome! 😊 Happy to help! If you have more questions about vehicles, pricing, booking, or anything else, just ask. Ready to book? Use the search feature to find your perfect vehicle. Have a great trip! 🚗";
  }
  
  // Bye/goodbye
  if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
    return "Goodbye! 👋 Thanks for using NexSpark. Remember:\n• 100+ vehicles from $50/day\n• Book in 5 minutes\n• 13+ cities available\n\nCome back anytime for help. Safe travels! 🚗";
  }
  
  // Default response - more helpful
  return "I can help you with **specific information** about NexSpark! Try asking:\n\n**Vehicle questions:**\n• \"Show me SUVs\" / \"I need a car for 5 people\"\n• \"What's the cheapest option?\" / \"BMW available?\"\n\n**Booking questions:**\n• \"How do I book?\" / \"What do I need to rent?\"\n• \"How much does it cost?\" / \"Where are you located?\"\n\n**Policy questions:**\n• \"Cancellation policy?\" / \"Insurance included?\"\n• \"Fuel policy?\" / \"Age requirements?\"\n\nAsk me anything specific, and I'll give you accurate details! 😊";
};

// Preprocess message to enhance understanding
const preprocessMessage = (message) => {
  let processed = message.toLowerCase().trim();
  
  // Normalize common variations
  const replacements = {
    'how much': 'price',
    'what is the cost': 'price',
    'what does it cost': 'price',
    'how expensive': 'price',
    'need a car': 'recommend',
    'looking for': 'recommend',
    'want to rent': 'book',
    'want to hire': 'book',
    'wanna rent': 'book',
    'can i rent': 'book',
    'available': 'check availability'
  };
  
  for (const [key, value] of Object.entries(replacements)) {
    if (processed.includes(key)) {
      processed = processed.replace(key, value);
    }
  }
  
  return processed;
};

// Main chat handler
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Log the incoming message for analytics
    console.log(`User query: "${message}"`);
    
    const provider = process.env.AI_PROVIDER || 'openai';
    let reply;

    // Preprocess message for better understanding
    const processedMessage = preprocessMessage(message);

    // Try to get AI response based on provider
    try {
      if (provider === 'openai' && process.env.OPENAI_API_KEY) {
        if (!aiClient) initializeAI();
        reply = await chatWithOpenAI(message, conversationHistory);
        console.log('✓ Response from OpenAI');
      } else if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
        reply = await chatWithGemini(message, conversationHistory);
        console.log('✓ Response from Gemini');
      } else if (provider === 'local' && process.env.LOCAL_MODEL_URL) {
        reply = await chatWithLocalModel(message, conversationHistory);
        console.log('✓ Response from Local Model');
      } else {
        // No AI configured, use intelligent fallback
        reply = getFallbackResponse(processedMessage);
        console.log('✓ Response from Fallback (no AI configured)');
      }
    } catch (aiError) {
      console.error('AI Error, using fallback:', aiError.message);
      reply = getFallbackResponse(processedMessage);
      console.log('✓ Response from Fallback (AI error)');
    }

    // Ensure reply is not empty
    if (!reply || reply.trim() === '') {
      reply = "I'm here to help! Ask me about vehicle types, pricing, booking process, or any questions about NexSpark rentals. 😊";
    }

    res.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString(),
      provider: provider
    });

  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred processing your message',
      reply: getFallbackResponse(req.body.message || '')
    });
  }
};

// Health check endpoint
exports.healthCheck = (req, res) => {
  const provider = process.env.AI_PROVIDER || 'fallback';
  const isConfigured = 
    (provider === 'openai' && process.env.OPENAI_API_KEY) ||
    (provider === 'gemini' && process.env.GEMINI_API_KEY) ||
    (provider === 'local' && process.env.LOCAL_MODEL_URL);

  res.json({
    status: 'healthy',
    service: 'chatbot-service',
    provider: isConfigured ? provider : 'fallback',
    timestamp: new Date().toISOString()
  });
};

// Initialize AI on module load
initializeAI();
