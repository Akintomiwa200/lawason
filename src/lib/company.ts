export const company = {
  name: "GM Lawason Studios",
  shortName: "GMLawason",
  tagline: "Filmmaking · Cinematography · Special Effect Lighting",
  description:
    "Nigerian production studio crafting cinematic stories through film, lighting design, and visual storytelling.",
  location: "Ikorodu, Lagos State, Nigeria",
  founded: "2010",
  social: {
    instagram: "https://www.instagram.com/gmlawasonstudios/",
    linkedin: "https://www.linkedin.com/in/godwin-lawani-8b208794",
  },
} as const;

export const founder = {
  name: "Godwin Lawani",
  role: "Light Designer · Scriptwriter · Cinematographer",
  bio: "Godwin Lawani has worked as a light designer and gaffer in the Nigerian film industry since 2010, shaping scenes through precision lighting, scripting, and cinematography. He leads GM Lawason Studios from Ikorodu, Lagos — building productions, training teams, and sharing industry knowledge with the next generation of filmmakers.",
  education:
    "Diploma in Film & Motion Picture Production — National Film Institute, Jos",
  experience: "Light designer & gaffer in Nollywood since 2010",
} as const;

export const academy = {
  name: "GM Lawason Academy for Film and Media",
  description:
    "An initiative focused on professional lighting training, filmmaking craft, and media production education — helping creatives grow from set basics to industry-ready skills.",
} as const;

export const stats = [
  { value: "2010", label: "Active in Nollywood" },
  { value: "5+", label: "Core disciplines" },
  { value: "Lagos", label: "Studio base" },
  { value: "24/7", label: "Production mindset" },
] as const;

export const services = [
  {
    slug: "filmmaking",
    title: "Filmmaking",
    summary: "End-to-end production from concept to final cut.",
    description:
      "Full-spectrum film production for narratives, commercials, and branded content — managed with cinematic intent from pre-production through post.",
    highlights: [
      "Pre-production & planning",
      "On-set direction",
      "Post-production coordination",
    ],
  },
  {
    slug: "cinematography",
    title: "Cinematography",
    summary: "Visual storytelling with depth, mood, and motion.",
    description:
      "Camera work crafted to serve the story — composition, movement, and lens choices that elevate every frame on screen.",
    highlights: [
      "Camera operation",
      "Visual direction",
      "Shot design & framing",
    ],
  },
  {
    slug: "lighting",
    title: "Special Effect Lighting",
    summary: "Light as a character — mood, drama, and atmosphere.",
    description:
      "Professional gaffer and lighting design services for film sets, including special effect lighting that transforms ordinary scenes into cinematic moments.",
    highlights: [
      "Gaffer services",
      "Special effect lighting",
      "Set lighting design",
    ],
  },
  {
    slug: "scriptwriting",
    title: "Scriptwriting",
    summary: "Stories built with structure, voice, and visual intent.",
    description:
      "Script development for film and media projects — from early drafts to shoot-ready screenplays aligned with production and lighting vision.",
    highlights: [
      "Screenplay development",
      "Story structure",
      "Production-ready scripts",
    ],
  },
  {
    slug: "production-design",
    title: "Production Design",
    summary: "Cohesive visual worlds on set and on screen.",
    description:
      "Design support that unifies look, feel, and environment — ensuring every visual element supports the narrative and lighting plan.",
    highlights: [
      "Visual concept",
      "Set aesthetics",
      "Look development",
    ],
  },
] as const;

export const workItems = [
  {
    slug: "gaffer-man-show",
    title: "The Gaffer Man Show",
    category: "Original Series",
    description:
      "A studio-led show going behind the scenes with industry leaders — honest conversations about process, leadership, and what it takes to become a great boss on and off set.",
    tag: "Featured",
  },
  {
    slug: "nollywood-lighting",
    title: "Nollywood Set Lighting",
    category: "Production",
    description:
      "Professional gaffer and lighting team services across Nigerian film productions — delivering consistent, cinematic light on demanding schedules.",
    tag: "Lighting",
  },
  {
    slug: "amriona-light-team",
    title: "Amriona Light Team",
    category: "Collaboration",
    description:
      "Specialist lighting team deployments for productions requiring precision gaffer work, rigging, and on-set light design expertise.",
    tag: "Team",
  },
  {
    slug: "film-academy",
    title: "GM Lawason Academy",
    category: "Education",
    description:
      "Training the next generation of filmmakers and lighting professionals through hands-on education in film and media production.",
    tag: "Academy",
  },
] as const;

export const values = [
  {
    title: "Light-first thinking",
    copy: "Every frame starts with how it feels when properly lit — mood, depth, and story come through the gaffer’s eye.",
  },
  {
    title: "Craft on set",
    copy: "Real production experience since 2010, built on the pace and standards of the Nigerian film industry.",
  },
  {
    title: "Stories with purpose",
    copy: "From script to screen, every project is shaped to connect — visually, emotionally, and professionally.",
  },
] as const;

export type Company = typeof company;
