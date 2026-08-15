import { eventLines, type EventCardPayload } from "@/types/events";

const defaults: Record<
  EventCardPayload["type"],
  { outline: string; audience: string; includes: string; scheduleNotes: string }
> = {
  CAMP: {
    outline:
      "Lighting, camera, and storytelling on a working set\nDepartment rotations with academy mentors\nA short scene planned, lit, and shot as a crew\nSafety, communication, and on-set discipline",
    audience:
      "Young creatives and first-time crew who want real set time, not only classroom theory.",
    includes:
      "Studio and location days\nCamera and lighting package access\nMeals on shoot days\nCertificate of attendance",
    scheduleNotes:
      "Morning call for briefing and department assign.\nMidday: practicals and scene work.\nLate afternoon: playback, notes, and wrap.",
  },
  WORKSHOP: {
    outline:
      "Hands-on craft for one department\nLive demos on a lit set\nGuided practice with feedback\nA takeaway shot list or lighting plot",
    audience:
      "Assistants and emerging crew who already know the basics and want sharper set craft.",
    includes:
      "Full workshop day(s)\nKit access during sessions\nPrinted or digital notes\nStudio certificate",
    scheduleNotes:
      "Arrival and kit briefing.\nDemo, then supervised practice.\nReview and Q&A before wrap.",
  },
  MASTERCLASS: {
    outline:
      "Look development with the gaffer or DoP\nMotivated sources, practicals, and effects\nLeadership and communication on a fast day\nA scene built from brief to last look",
    audience:
      "Working lighting and camera crew who want department-head level decision making.",
    includes:
      "Intensive studio sessions\nFull lighting / camera package\nLook book or plot notes\nCertificate of attendance",
    scheduleNotes:
      "Look brief and recce.\nBuild, light, and shoot the scene.\nPlayback and notes with the lead.",
  },
  OTHER: {
    outline:
      "Studio walkthrough or community session\nMeet the lighting and camera team\nSee a working plot or finished work\nAsk questions in an open Q&A",
    audience:
      "Students, parents, and collaborators who want to see how the studio works.",
    includes:
      "Session access\nStudio hospitality\nTime with the team",
    scheduleNotes: "Doors open for check-in.\nMain session.\nQ&A and close.",
  },
};

export function eventPageCopy(event: EventCardPayload) {
  const fallback = defaults[event.type];
  return {
    outline: eventLines(event.outline).length ? eventLines(event.outline) : eventLines(fallback.outline),
    audience: event.audience?.trim() || fallback.audience,
    includes: eventLines(event.includes).length ? eventLines(event.includes) : eventLines(fallback.includes),
    schedule: eventLines(event.scheduleNotes).length
      ? eventLines(event.scheduleNotes)
      : eventLines(fallback.scheduleNotes),
  };
}
