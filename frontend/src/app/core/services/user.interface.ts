export interface User { 
    id: string; 
    email: string; 
    name?: string;
    role?: string;
    sub?: string; // Sometimes JWT stores ID here
}
