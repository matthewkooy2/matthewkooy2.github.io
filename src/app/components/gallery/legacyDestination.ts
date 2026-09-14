import { PROJECTS } from "../../projects/data";
import { experiences, extracurriculars } from "./content";

/** Keep old bookmarks useful without exposing the retired multi-page layout. */
export function getLegacyDestination(pathname: string, hash = "") {
  const path = pathname.replace(/\/$/, "");
  if (path === "/about") return "/#hero";
  if (path === "/contact") return "/#contact";
  if (path === "/experience") {
    const slug = hash.replace(/^#/, "");
    if (experiences.some(item => item.id === slug)) return `/#work-${slug}`;
    if (extracurriculars.some(item => item.id === slug)) return `/#club-${slug}`;
    return "/#work";
  }
  if (path.startsWith("/projects/")) {
    const slug = path.slice("/projects/".length);
    if (PROJECTS.some(project => project.id === slug)) return `/#project-${slug}`;
  }
  return "/#projects";
}
