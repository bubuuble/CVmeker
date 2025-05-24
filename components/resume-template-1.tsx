import Image from "next/image";

// Types for resume data
interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  photoUrl?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  additionalLinks?: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

interface Portfolio {
  id: number;
  title: string;
  imageUrl?: string;
  link?: string;
  description: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  portfolio: Portfolio[];
}

export function ResumeTemplate1({
  data,
  lang,
}: {
  data: ResumeData;
  lang?: "en" | "id";
}) {
  const { personalInfo, experience, education, skills, portfolio } = data;
  // Label translations
  const t = (en: string, id: string) => (lang === "id" ? id : en);

  // Helper to get the link value, preferring 'additionalLinks' then 'additionalLink'
  const getAdditionalLink = () => {
    if (personalInfo.additionalLinks && personalInfo.additionalLinks.trim() !== '') {
      return personalInfo.additionalLinks;
    }
    if ((personalInfo as any).additionalLink && (personalInfo as any).additionalLink.trim() !== '') {
      return (personalInfo as any).additionalLink;
    }
    return null;
  };
  const additionalLinkValue = getAdditionalLink();

  return (
    <div className="w-full max-w-[800px] mx-auto p-8 font-sans bg-white text-black">
      {/* Header */}
      <div className="mb-6 text-center">
        {personalInfo.photoUrl && (
          <div className="mb-3 flex justify-center">
            <Image
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              width={120}
              height={120}
              className="rounded-full object-cover border border-gray-300"
              style={{
                maxWidth: 160, 
                maxHeight: 160, 
                width: "auto",  
                height: "auto", 
              }}
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-1">{personalInfo.fullName}</h1>
        <p className="text-lg text-gray-600 mb-3">{personalInfo.title}</p>
        
        {/* Contact Information with Text-based Icons */}
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo.email && (
            <div className="inline-block mx-2">
              <span className="font-bold">✉</span> {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="inline-block mx-2">
              <span className="font-bold">☎</span> {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="inline-block mx-2">
              <span className="font-bold">📍</span> {personalInfo.location}
            </div>
          )}
        </div>
        
        {/* Social Links with Text-based Icons */}
        {(personalInfo.linkedin || personalInfo.github || personalInfo.instagram) && (
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            {personalInfo.linkedin && (
              <div className="inline-block mx-2">
                <span className="font-bold">💼</span> 
                <a
                  href={!personalInfo.linkedin.startsWith('http') ? `https://${personalInfo.linkedin}` : personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary ml-1"
                >
                  {personalInfo.linkedin}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="inline-block mx-2">
                <span className="font-bold">⚡</span>
                <a
                  href={!personalInfo.github.startsWith('http') ? `https://${personalInfo.github}` : personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary ml-1"
                >
                  {personalInfo.github}
                </a>
              </div>
            )}
            {personalInfo.instagram && (
              <div className="inline-block mx-2">
                <span className="font-bold">📷</span>
                <a
                  href={!personalInfo.instagram.startsWith('http') ? `https://${personalInfo.instagram}` : personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary ml-1"
                >
                  {personalInfo.instagram}
                </a>
              </div>
            )}
          </div>
        )}
        
        {additionalLinkValue && (
          <div className="text-sm text-gray-600 mt-2">
            <div className="inline-block mx-2">
              <span className="font-bold">🔗</span>
              <a
                href={!additionalLinkValue.startsWith('http') ? `https://${additionalLinkValue}` : additionalLinkValue}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary ml-1"
              >
                {additionalLinkValue}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          {t("Professional Summary", "Ringkasan Profesional")}
        </h2>
        <p className="text-gray-700">{personalInfo.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          {t("Work Experience", "Pengalaman Kerja")}
        </h2>
        {experience.map((exp: Experience) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.position}</h3>
              <span className="text-sm text-gray-600">
                {exp.startDate} - {exp.endDate}
              </span>
            </div>
            <p className="text-gray-700 font-medium">{exp.company}</p>
            <p className="text-gray-700 mt-1">
              {exp.description
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "")
                .map((line, idx) => (
                  <span
                    key={idx}
                    className="block before:content-['•'] before:mr-2"
                  >
                    {line}
                  </span>
                ))}
            </p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          {t("Education", "Pendidikan")}
        </h2>
        {education.map((edu: Education) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <span className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <p className="text-gray-700 font-medium">{edu.institution}</p>
            {edu.gpa && (
              <p className="text-gray-700 text-sm mt-1">{lang === 'id' ? 'IPK' : 'CGPA'}: {edu.gpa}</p>
            )}
            <p className="text-gray-700 mt-1">
              {edu.description
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "")
                .map((line, idx) => (
                  <span
                    key={idx}
                    className="block before:content-['•'] before:mr-2"
                  >
                    {line}
                  </span>
                ))}
            </p>
          </div>
        ))}
      </div>

      {/* Skills - 4 Skills Per Row */}
      <div className={portfolio && portfolio.length > 0 ? "mb-6" : ""}>
        <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
          {t("Skills", "Keahlian")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 text-gray-700 text-sm py-1 px-3"
              style={{ 
                width: 'calc(25% - 6px)',
                minWidth: '120px'
              }}
            >
              <span className="block before:content-['•'] before:mr-2">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      {portfolio && portfolio.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3">
            {t("Portfolio", "Portofolio")}
          </h2>
          {portfolio.map((item: Portfolio) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              {item.link && (
                <a
                  href={!item.link.startsWith('http') ? `https://${item.link}` : item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 block mb-2"
                >
                  {item.link}
                </a>
              )}
              {item.imageUrl && (
                <div className="mb-3">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="rounded border border-gray-300 object-cover"
                    style={{
                      maxWidth: 300,
                      maxHeight: 200,
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>
              )}
              <p className="text-gray-700">
                {item.description
                  .split(/\r?\n/)
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => (
                    <span
                      key={idx}
                      className="block before:content-['•'] before:mr-2"
                    >
                      {line}
                    </span>
                  ))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}