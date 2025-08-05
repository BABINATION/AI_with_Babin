document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mainMenu = document.querySelector('.main-menu-container');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // --- Typewriter Effect ---
    const typewriterTarget = document.getElementById('babin-name-typewriter');
    const cursor = document.querySelector('.typing-cursor');
    const textToType = "Babin";
    let charIndex = 0;

    function type() {
        if (charIndex < textToType.length) {
            typewriterTarget.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 150);
        } else {
            if (cursor) cursor.style.display = 'none';
        }
    }
    setTimeout(type, 1000);

    // --- Slideshow Management ---
    const slideshows = {};

    function initializeSlideshow(container) {
        const slides = container.querySelectorAll('.slide');
        if (slides.length === 0) return null;

        const state = {
            container,
            slides,
            totalSlides: slides.length,
            currentSlide: 0,
            prevButton: container.querySelector('.nav-button.prev'),
            nextButton: container.querySelector('.nav-button.next'),
            slideCounter: container.querySelector('.slide-counter'),
            navDotsContainer: container.querySelector('.nav-dots'),
            closeBtn: container.querySelector('.close-slideshow-btn')
        };

        const setupNavDots = () => {
            state.navDotsContainer.innerHTML = '';
            for (let i = 0; i < state.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('nav-dot');
                dot.dataset.index = i;
                dot.addEventListener('click', () => showSlide(i));
                state.navDotsContainer.appendChild(dot);
            }
        };
        
        const updateNavUI = (index) => {
            if (state.slideCounter) {
                 state.slideCounter.textContent = state.totalSlides > 1 ? `Slide ${index + 1} of ${state.totalSlides}` : '';
            }
            const dots = state.navDotsContainer.querySelectorAll('.nav-dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        const showSlide = (index) => {
            if (index >= state.totalSlides || index < 0) return;
            state.currentSlide = index;
            const newSlide = state.slides[index];
            const theme = newSlide.getAttribute('data-theme');
            
            body.className = '';
            if (theme === 'light') body.classList.add('light-theme');
            else if (theme === 'dark') body.classList.add('dark-theme');
            else if (theme === 'gradient') body.classList.add('gradient-theme');
            else body.classList.add('dark-theme');
            
            state.slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            
            if(state.prevButton) state.prevButton.style.display = (index === 0 || state.totalSlides <= 1) ? 'none' : 'flex';
            if(state.nextButton) state.nextButton.style.display = (index === state.totalSlides - 1 || state.totalSlides <= 1) ? 'none' : 'flex';
            updateNavUI(index);
        };

        state.nextButton?.addEventListener('click', () => showSlide(state.currentSlide + 1));
        state.prevButton?.addEventListener('click', () => showSlide(state.currentSlide - 1));
        state.closeBtn?.addEventListener('click', () => {
            mainMenu.classList.remove('hidden');
            container.classList.remove('visible');
            body.className = 'dark-theme';
        });

        setupNavDots();
        
        return { show: () => showSlide(0), container: container };
    }

    document.querySelectorAll('.slideshow-container').forEach(container => {
        const id = container.id.replace('-slideshow', '');
        slideshows[id] = initializeSlideshow(container);
    });

    categoryButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', () => {
                const slideshowId = button.dataset.slideshow;
                if (slideshows[slideshowId] && slideshows[slideshowId].container) {
                    mainMenu.classList.add('hidden');
                    slideshows[slideshowId].container.classList.add('visible');
                    slideshows[slideshowId].show();
                }
            });
        }
    });

    // --- Interactive Logic for Phases Slide ---
    const phaseDescriptions = {
        unaware: { title: "Unaware", description: "You don't realize where or how AI is involved in your daily life. You may be using it without knowing — like when YouTube recommends your next video, or your phone suggests words while you type." },
        curious: { title: "Curious", description: "You’veheard about AI tools and start to get interested. Maybe you try ChatGPT for the first time, use an AI image generator, or explore how AI writes emails or captions. It feels new and exciting, but you're just testing the waters." },
        active: { title: "Active User of Basics", description: "AI becomes part of your routine in simple but helpful ways. You use AI to summarize text, help with writing, translate languages, or improve your photos. You know how to get results and start depending on it for small tasks." },
        integrator: { title: "Integrator", description: "You go beyond casual use and integrate AI into your workflow or creative process. You combine tools for content creation, automate emails, draft presentations, analyze data, or even use AI for coding. It saves you time and boosts your output." },
        innovator: { title: "Strategic Thinker & Innovator", description: "You understand the broader capabilities and impact of AI. You think about how it can transform industries, solve complex problems or even change the way people live and work. You share ideas, teach others, or explore building your own AI solutions. You’re not just using AI — you’re shaping how it’s used." }
    };
    const phaseNavItems = document.querySelectorAll('.phase-nav-item');
    const phaseTitle = document.getElementById('phase-title');
    const phaseDescription = document.getElementById('phase-description');

    function updatePhaseContent(phaseKey) {
        const content = phaseDescriptions[phaseKey];
        if(phaseTitle && phaseDescription) {
            phaseTitle.textContent = content.title;
            phaseDescription.textContent = content.description;
        }
        phaseNavItems.forEach(item => item.classList.toggle('active', item.dataset.phase === phaseKey));
    }

    phaseNavItems.forEach(item => {
        item.addEventListener('click', () => updatePhaseContent(item.dataset.phase));
    });

    if (phaseNavItems.length > 0) {
        updatePhaseContent('unaware');
    }

    // --- Interactive Logic for Terminologies Slide ---
    const termDescriptions = {
        agentic: { title: "Agentic AI", def: "Agentic AI refers to artificial intelligence systems capable of performing tasks independently by making decisions and taking actions without continuous human input.", analogy: "Imagine a helpful robot assistant that not only listens to your commands but can figure out what needs to be done next and take care of it on its own. It’s like having a smart helper who plans your day or manages your smart home without you needing to guide every step.", examples: ["Personal digital assistants scheduling meetings", "Autonomous delivery drones", "Smart thermostats adjusting to your habits", "AI chatbots managing customer service on their own"] },
        api: { title: "API", fullname: "Application Programming Interface", def: "An API is a set of protocols and tools that allow different software applications to communicate and work together seamlessly.", analogy: "Think of an API as a translator or bridge that helps two different apps talk to each other and share information smoothly, just like a waiter taking your order to the kitchen and bringing back your meal.", examples: ["Google Maps embedded in a food delivery app", "ChatGPT integrated into a customer support system", "Payment gateways like PayPal in online shopping", "Weather information shown in fitness apps"] },
        genai: { title: "Gen AI", fullname: "Generative Artificial Intelligence", def: "Generative AI is a type of AI that can create new content such as text, images, music, or videos based on learned patterns from existing data.", analogy: "Imagine a creative artist robot that studies thousands of paintings or stories and then makes new and original masterpieces all by itself. It doesn’t just copy; it invents and surprises you with its creativity.", examples: ["DALL·E or Midjourney generating images from text prompts", "ChatGPT writing emails, articles, or stories", "AI composing music for videos or games", "Creating realistic avatars or deepfake videos"] },
        gpt: { title: "GPT", fullname: "Generative Pre-trained Transformer", def: "GPT (Generative Pretrained Transformer) is a type of large language model that generates human-like text by using a neural network architecture called a Transformer. It is trained on massive amounts of data before being fine-tuned for specific tasks.", analogy: "🤓 Layman’s Explanation: Think of GPT like a super-smart robot that has read almost everything on the internet. It first pre-learns (pretrained) how language works by reading billions of words — like how we learn by reading books. Then it generates (Generative) new sentences, stories, or answers based on what you ask. The 'Transformer' part is the brain structure that helps it remember what you just said and respond accordingly — like a hyperactive librarian with perfect memory.", examples: ["GPT-3 — First famous version to write essays, poems, code", "GPT-3.5 — Powers ChatGPT’s free version", "GPT-4 — Smarter, more accurate", "GPT-4o — The latest, multimodal (text, image, audio)"] },
        json: { title: "JSON", fullname: "JavaScript Object Notation", def: "JSON is a lightweight, text-based format used to store and exchange data between a server and a web application in a structured, easy-to-read way.", analogy: "Think of JSON as a simple way to pack and send information that both humans and machines can understand. It’s like writing data in a neat list or dictionary that everyone agrees on, so apps can talk to each other without confusion.", examples: ["Websites sending user info from the browser to the server", "APIs returning weather data or stock prices in JSON format", "Configuration files for apps or games", "Storing data in databases like MongoDB that use JSON-like documents"] },
        llm: { title: "LLM", fullname: "Large Language Model", def: "A Large Language Model is an AI system trained on vast collections of text to understand and generate language naturally and accurately.", analogy: "Imagine a super-smart librarian who remembers every book ever written and helps you write, summarize, or translate with ease and precision.", examples: ["GPT-4o (OpenAI) - Multimodal flagship model that powers ChatGPT. Fast, powerful, understands text, images, and even audio.", "Claude 3 Opus (Anthropic) - A top-tier model from Anthropic known for being thoughtful, accurate, and less likely to hallucinate.", "Gemini 1.5 Pro (Google DeepMind) - Previously known as Bard, now rebranded as Gemini. Very capable across reasoning, coding, and multi-modal tasks.", "Mistral Large (Mistral AI) - Open-weight model from France, known for transparency and speed. Strong open-source alternative.", "LLaMA 3 70B (Meta AI) - Open-source model from Meta (Facebook). Popular for researchers and developers building custom AI apps.", "Grok-1 (xAI / Elon Musk) - Powers Grok chatbot on X (formerly Twitter). Optimized for real-time social media context.", "Command R+ (Cohere) - Specializes in Retrieval-Augmented Generation (RAG). Great for enterprise and document Q&A tasks.", "Yi-34B (01.AI - China) - Powerful bilingual open model (Chinese-English), rapidly gaining attention globally.", "Mixtral 8x7B (Mistral AI) - Mixture of Experts (MoE) architecture. Efficient and strong performance, popular among open-source communities.", "Gemma (Google) - Lightweight, open models from Google for local/on-device use. Designed to compete with LLaMA and Mistral."] },
        ml: { title: "ML", fullname: "Machine Learning", def: "Machine Learning is a method where computers learn to perform tasks by recognizing patterns in data rather than following explicit instructions.", analogy: "It’s like training a dog with treats instead of a manual — the more examples it sees, the better it learns to do the trick.", examples: ["Email spam filters", "Netflix and YouTube recommendations", "Voice assistants like Alexa and Siri", "Fraud detection in banking"] },
        nlp: { title: "NLP", fullname: "Natural Language Processing", def: "Natural Language Processing is a field of AI that enables machines to understand, interpret, generate, and respond to human language.", analogy: "NLP is what makes computers 'talk' and 'listen' like humans. Think of it as the brainpower behind AI tools that can chat, translate, or even write essays. It’s like teaching machines to understand us the way a friend would in conversation.", examples: ["ChatGPT understanding and replying to your questions", "Google Translate converting languages", "Siri or Alexa understanding voice commands", "Grammarly checking grammar and tone in your writing", "Spam filters identifying junk emails"] },
        neural: { title: "Neural Networks", def: "Neural Networks are AI systems modeled after the human brain that process information through interconnected nodes to recognize complex patterns.", analogy: "Think of a giant web where each point helps pass information along, allowing the AI to “think” in a way similar to humans.", examples: ["Face recognition unlocking phones", "Self-driving cars detecting obstacles", "Speech-to-text transcription", "AI detecting medical conditions in images"] },
        ollama: { title: "Ollama", def: "Ollama is a platform that allows users to run and experiment with large language models (LLMs) locally on their own computers.", analogy: "Think of Ollama as your personal AI playground. Instead of relying on cloud-based AI like ChatGPT, it brings models directly to your machine so you can play with them offline. It’s like downloading the brain instead of just chatting with it online.", examples: ["Running LLaMA or Mistral models locally without internet", "Developers testing custom AI applications on personal laptops", "Offline coding assistants and AI chatbots on your own PC", "A privacy-friendly way to use AI tools without sending data to the cloud"] },
        opensource: { title: "Open Source", def: "Open Source refers to software whose code is openly available for anyone to use, modify, and share, fostering collaboration and innovation.", analogy: "It’s like a community cookbook where everyone can add their recipes, improve existing ones, and share them freely.", examples: ["Linux operating system", "TensorFlow and PyTorch AI frameworks", "Firefox browser", "Some versions of OpenAI’s GPT models"] },
        rag: { title: "RAG", fullname: "Retrieval-Augmented Generation", def: "RAG is an AI technique that combines retrieval of relevant information from external sources with generative models to produce accurate and informed responses.", analogy: "Imagine a student who first looks up textbooks or notes before answering a question, combining research with creativity to provide the best answer possible.", examples: ["Chatbots that search company documents to give precise answers", "AI tools that retrieve facts from databases while composing reports", "Virtual assistants accessing updated info from the web before replying"] },
        saas: { title: "SaaS", fullname: "Software as a Service", def: "Software as a Service is a cloud-based delivery model where software is hosted online and accessed via the internet, rather than being installed locally.", analogy: "SaaS is like renting software instead of buying it. You don’t need to install anything – just log in and use it, like streaming Netflix instead of buying DVDs. It’s the reason you don’t install apps like Google Docs or Canva – they live in your browser.", examples: ["Google Workspace (Docs, Sheets, Gmail)", "Canva for design", "Salesforce for customer management", "Zoom for meetings", "ChatGPT web app (subscription-based version)"] },
        schema: { title: "Schema", def: "In AI and data science, a schema is a structured framework or blueprint that defines how data is organized, stored, and related within a database or system.", analogy: "Think of a schema like the blueprint of a house — it tells you where the rooms are, how they connect, and what each space is used for. In AI, schemas help organize information so machines can understand and use it effectively.", examples: ["Database tables defining customer info (name, age, purchase history)", "JSON or XML formats that structure data sent between apps", "Knowledge graphs organizing facts and relationships for AI understanding", "Chatbots using schema to understand user intents and responses"] },
        singularity: { title: "Singularity", def: "The Singularity refers to a hypothetical future point when AI surpasses human intelligence, leading to unpredictable and potentially irreversible changes in society.", analogy: "This is the sci-fi side of AI – where machines become smarter than humans and might start making decisions for us. It’s like giving birth to a brain that outgrows us and becomes the boss. Some say it’ll be paradise; others say, “uh-oh.”", examples: ["Not real yet – but theorized in books and films like Her, Transcendence, or The Matrix", "Elon Musk, Ray Kurzweil, and others often talk about this future possibility", "Used in debates about the future of ethics, safety, and AI control"] },
        training: { title: "Training Data", def: "Training Data consists of labeled examples used to teach AI models how to perform specific tasks.", analogy: "Think of it as the practice drills that help athletes improve — the more diverse and high-quality the practice, the smarter the AI becomes.", examples: ["Thousands of labeled images to train image recognition", "Historical sales data for forecasting", "Recorded conversations improving voice assistants", "Medical records training AI for diagnosis"] }
    };
    const termNavItems = document.querySelectorAll('.term-nav-item');
    const termTitle = document.getElementById('term-title');
    const termFullname = document.getElementById('term-fullname');
    const termDef = document.getElementById('term-main-def');
    const termAnalogy = document.getElementById('term-analogy');
    const termExamples = document.getElementById('term-examples');

    function updateTermContent(termKey) {
        const content = termDescriptions[termKey];
        if (content) {
            termTitle.textContent = content.title;
            termFullname.textContent = content.fullname ? `(${content.fullname})` : '';
            termDef.textContent = content.def;
            termAnalogy.textContent = content.analogy;
            termExamples.innerHTML = '';
            content.examples.forEach(ex => {
                const li = document.createElement('li');
                li.innerHTML = ex;
                termExamples.appendChild(li);
            });
        }
        termNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.term === termKey);
        });
    }

    termNavItems.forEach(item => {
        item.addEventListener('click', () => updateTermContent(item.dataset.term));
    });

    if (termNavItems.length > 0) {
        updateTermContent('agentic');
    }

});