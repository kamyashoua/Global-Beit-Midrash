import { JourneyExperience } from "@/components/journey/JourneyExperience";
import { LanguageProvider } from "@/context/LanguageProvider";
import { JourneyProvider } from "@/context/JourneyProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <JourneyProvider>
        <JourneyExperience />
      </JourneyProvider>
    </LanguageProvider>
  );
}
