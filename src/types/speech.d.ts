// speech.d.ts

interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;

    start(): void;
    stop(): void;
    abort(): void;

    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
    error:
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported";
    message: string;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface Window {
    SpeechRecognition?: {
        new(): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
        new(): SpeechRecognition;
    };
}

// class Project(BaseModel):
//     name: Optional[str] = None
//     description: Optional[str] = None
//     link: Optional[str] = None
//     technologies: List[str] = []

// class Certification(BaseModel):
//     name: Optional[str] = None
//     issuer: Optional[str] = None
//     year: Optional[str] = None

// class Education(BaseModel):
//     institution: Optional[str] = None
//     degree: Optional[str] = None
//     startYear: Optional[str] = None
//     endYear: Optional[str] = None


// class Experience(BaseModel):
//     company: Optional[str] = None
//     position: Optional[str] = None
//     startDate: Optional[str] = None
//     endDate: Optional[str] = None
//     description: Optional[str] = None
interface ExperienceType {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}



interface Education {
    institution: string;
    degree: string;
    startYear: number;
    endYear: number;
}

interface Projects {
    name?: string;
    description?: string;
    link?: string | null;
    technologies?: string[];
}

interface Certifications {
    name?: string;
    issuer?: string;
    year?: number;
}