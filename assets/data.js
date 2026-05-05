import { ArchiveIcon, CreditCard, Files, LayoutDashboard, Notebook, Pin, Receipt, Trash2, Upload, User } from "lucide-react";

export const features = [
    {
        iconName: "ArrowUpCircle",
        iconColor: "text-purple-500",
        title: "Easy File Upload",
        description: "Quickly upload your files with our intuitive drag-and-drop interface."
    },
    {
        iconName: "Shield",
        iconCover: "text-green-500",
        title: "Secure Storage",
        description: "Your files are encrypted and stored securely in our cloud infrastructure."
    },


    {
        iconName: "Share2",
        iconCoser: "text-purple-500",
        title: "Simple Sharing",
        description: "Share files with anyone using secure links that you control"
    },
    {
        iconName: "CreditCard",
        iconColor: "text-orange-500",
        title: "Flexible Credits",
        description: "Pay only for what you use with our credit-based system."
    },
    {
        iconName: "FileText",
        iconColor: "text-red-500",
        title: "File Management",
        description: "Organize, preview, and manage your files from any device.",
    },
    {
        iconNo: "Clock",
        iconColor: "text-indigo-500",
        title: "Transaction History",
        description: "Keep track of all your credit purchases and usage.",
    },
];

export const pricingPlans = [
    {
        name: "Basic",
        price: "100",
        description: "For individuals getting started",
        features: [
            "100 file uploads",
            "Basic file sharing",
            "7-day file retention",
            "Email support",
        ],
        cta: "Get Started",
        highlighted: false,
    },
    {
        name: "Premium",
        price: "500",
        description: "For individuals with larger needs",
        features: [
            "500 file uploads",
            "Advanced file sharing",
            "30-day file retention",
            "Priority email support",
            "File analytics",
        ],
        cta: "Go Premium",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "2000",
        description: "For businesses and large teams",
        features: [
            "Unlimited file uploads",
            "Advanced security features",
            "Customizable file retention",
            "Dedicated support",
            "Comprehensive analytics",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
];

export const testimonials = [
    {
        name: "Alice Johnson",
        role: "Freelance Designer",
        company: "Self-Employed",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        quote:
            "This platform has revolutionized the way I manage my files. The intuitive interface and seamless upload process have saved me countless hours.",
        rating: 5,
    },
    {
        name: "Michael Smith",
        role: "Project Manager",
        company: "Tech Solutions Inc.",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        quote:
            "As a project manager, I rely heavily on efficient file management. This service has exceeded my expectations with its robust features and reliability.",
        rating: 4,
    },
    {
        name: "Samantha Lee",
        role: "Content Creator",
        company: "Creative Media",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        quote:
            "I can't imagine going back to my old file management system. The ease of use and excellent customer support make this platform a must-have for anyone in the digital space.",
        rating: 5,
    },
    {
        name: "David Brown",
        role: "Entrepreneur",
        company: "Startup Hub",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        quote:
            "Managing files used to be a hassle, but this platform has made it effortless. The subscription plans are flexible, and the transaction history feature keeps me organized.",
        rating: 4,
    },
    {
        name: "Emily Davis",
        role: "Marketing Specialist",
        company: "Bright Marketing",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        quote:
            "The secure storage and sharing options have been a game-changer for our marketing team. We can collaborate seamlessly without worrying about file security.",
        rating: 5,

    },{
        name: "James Wilson",
        role: "Software Developer",
        company: "CodeCrafters",
        image: "https://randomuser.me/api/portraits/men/33.jpg",
        quote:
            "This platform's file management capabilities are top-notch. The ability to preview files and manage them from any device has significantly improved my workflow.",
        rating: 4,
    }
];
export const SIDE_MENU_DATA = [
    {
        id:"01",
        label:"Dashboard",
        icon:LayoutDashboard,
        path:"/community/dashboard"
    },{
        id:"02",
        label:"Create Note",
        icon:Upload,
        path:"/community/create-note"
    },{
        id:"03",
        label:"My Notes",
        icon:Notebook,
        path:"/community/my-notes"
    },
    {
        id:"04",
        label:"Pinned Notes",
        icon:Pin,
        path:"/community/pinned-notes"
    },

    ,{
        id:"05",
        label:"Archives",
        icon:ArchiveIcon,
        path:"/community/archives"
    },
    
    {
        id:"06",
        label:"Trash",
        icon:Trash2,
        path:"/community/trash"
    },{
        id:"07",
        label:"Profile",
        icon:User,
        path:"/community/profile"
    }
]
