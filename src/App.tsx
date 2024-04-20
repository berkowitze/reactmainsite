import classNames from "classnames";
import { useEffect, useState } from "react";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Resume from "./sections/Resume";
import Art from "./sections/Art";

const ORDERED_SECTIONS = [
  { name: "About", color: "red", Page: About, fullScreen: false },
  { name: "Resume", color: "green", Page: Resume, fullScreen: true },
  { name: "Code", color: "blue", Page: About, fullScreen: false },
  { name: "Art", color: "orange", Page: Art, fullScreen: true },
  { name: "Contact", color: "purple", Page: Contact, fullScreen: false },
] as const satisfies ReadonlyArray<{
  name: string;
  color: string;
  Page: React.FC;
  fullScreen: boolean;
}>;

type Section = (typeof ORDERED_SECTIONS)[number];
type SectionName = Section["name"];

const SECTION_NAME_TO_SECTION = Object.fromEntries(
  ORDERED_SECTIONS.map((section) => [section.name, section])
) as Record<SectionName, Section>;

export default function App() {
  const [selectedSectionName, setSelectedSectionName] =
    useState<SectionName>("About");
  return (
    <>
      <div className="title grow-0 text-4xl">ELI BERKOWITZ</div>
      <Nav
        selectedSection={SECTION_NAME_TO_SECTION[selectedSectionName]}
        onChangeSelectedSection={setSelectedSectionName}
      />
      <MainContent
        selectedSection={SECTION_NAME_TO_SECTION[selectedSectionName]}
      />
    </>
  );
}

function Nav({
  selectedSection,
  onChangeSelectedSection,
}: {
  selectedSection: Section;
  onChangeSelectedSection: (newSectionName: SectionName) => void;
}) {
  return (
    <div className="nav hidden grow-0 flex-col gap-4 md:flex">
      {ORDERED_SECTIONS.map(({ name, color }) => (
        <div
          className="sliding-u-l-r-parent cursor-pointer"
          onClick={() => {
            onChangeSelectedSection(name);
          }}
          key={name}
        >
          <div
            className={classNames(
              "text-2xl sliding-u-l-r w-fit nav-link",
              color,
              selectedSection.name == name && "selected"
            )}
          >
            {name}
          </div>
        </div>
      ))}
    </div>
  );
}

function MainContent({ selectedSection }: { selectedSection: Section }) {
  useEffect(() => {
    document.title = `Eli Berkowitz - ${selectedSection.name}`;
  }, [selectedSection.name]);

  const selectedSectionIndex = ORDERED_SECTIONS.findIndex(
    (section) => section.name == selectedSection.name
  );

  return (
    <div className="content md:no-scrollbar relative flex grow flex-col gap-8 md:overflow-hidden">
      {ORDERED_SECTIONS.map((section, index) => (
        <div
          id={section.name}
          key={section.name}
          className={classNames(
            "grow-1 bg-white w-full md:h-fit p-4 md:overflow-auto md:max-h-full rounded-[4px] shadow-md border-t-4",
            "content-top-border transition-all duration-1000 md:absolute md:inset-0",
            section.color,
            selectedSection.name == section.name
              ? "opacity-100"
              : "md:opacity-0",
            section.fullScreen && "h-full",
            index < selectedSectionIndex // if the section is before the selected section, place it above the screen
              ? "md:-translate-y-[100vh]"
              : index > selectedSectionIndex
              ? // if the section is after the selected section, place it below the screen
                "md:translate-y-[100vh]"
              : undefined
          )}
        >
          <section.Page />
        </div>
      ))}
    </div>
  );
}
