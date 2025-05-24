"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ResumeTemplate1 } from "@/components/resume-template-1"

// Import jsPDF for PDF generation
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// Types for form data
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
  additionalLink?: string;
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

interface FormData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  portfolio: Portfolio[];
}

type SectionArray = "experience" | "education" | "portfolio";
type SectionObject = "personalInfo";

type Section = SectionArray | SectionObject;

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("template1")
  const [activeTab, setActiveTab] = useState("edit")
  const resumeRef = useRef(null)
  const [lang, setLang] = useState<'en' | 'id'>('en')

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary:
        "",
      photoUrl: "",
      linkedin: "",
      github: "",
      instagram: "",
      additionalLink: "",
    },
    experience: [],
    education: [],
    skills: [],
    portfolio: [],
  })

  // Function to generate and download PDF
  const generatePDF = async () => {
    if (!resumeRef.current) return

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      // A4 size in pt: 595.28 x 841.89 (jsPDF default unit is "pt")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Calculate the image dimensions to fit A4 while keeping aspect ratio
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let position = 0

      if (imgHeight < pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      } else {
        // If content is longer than one page, split into pages
        let remainingHeight = imgHeight
        let y = 0
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight)
          remainingHeight -= pageHeight
          if (remainingHeight > 0) {
            pdf.addPage()
            y -= pageHeight
          }
        }
      }

      pdf.save(`${formData.personalInfo.fullName.replace(/\s+/g, "-")}-Resume.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("There was an error generating your PDF. Please try again.")
    }
  }

  const handleInputChange = (
    section: SectionObject,
    field: keyof PersonalInfo,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayChange = (
    section: SectionArray,
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[section] as any[])]
      newArray[index] = {
        ...newArray[index],
        [field]: value,
      }
      return {
        ...prev,
        [section]: newArray as any,
      }
    })
  }

  const handleSkillChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newSkills = [...prev.skills]
      newSkills[index] = value
      return {
        ...prev,
        skills: newSkills,
      }
    })
  }

  const addItem = (section: SectionArray) => {
    setFormData((prev) => {
      const newId = Math.max(0, ...(prev[section].map((item: { id: number }) => item.id))) + 1
      let newItem: any = { id: newId }

      if (section === "experience") {
        newItem = {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        }
      } else if (section === "education") {
        newItem = {
          id: newId,
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
        }
      } else if (section === "portfolio") {
        newItem = {
          id: newId,
          title: "",
          imageUrl: "",
          link: "",
          description: "",
        }
      }

      return {
        ...prev,
        [section]: [...prev[section], newItem],
      }
    })
  }

  const removeItem = (section: SectionArray, id: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item: { id: number }) => item.id !== id),
    }))
  }

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const renderTemplate = () => {
    return <ResumeTemplate1 data={formData} lang={lang} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            <span>CV Maker</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Download PDF and Language buttons removed from here */}
          </div>
        </div>
      </header>

      <main className="container py-8 px-4 md:px-10">
        <div className="flex justify-end mb-4">
            <Button
              variant={lang === 'en' ? 'outline' : 'ghost'}
              onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
              className="gap-2"
            >
              {lang === 'en' ? '🇬🇧 English' : '🇮🇩 Bahasa Indonesia'}
            </Button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Create Your Resume</h1>

        {/* Template Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div>
            <div id="editor-section">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2 md:hidden">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {lang === 'en' ? 'Personal Information' : 'Informasi Pribadi'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="photoUrl">{lang === 'en' ? 'Photo Profile (Upload)' : 'Foto Profil (Unggah)'}</Label>
                          <Input
                            id="photoUrl"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    handleInputChange("personalInfo", "photoUrl", ev.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">{lang === 'en' ? 'Full Name' : 'Nama Lengkap'}</Label>
                          <Input
                            id="fullName"
                            value={formData.personalInfo.fullName}
                            onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. John Doe' : 'cth. Budi Santoso'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">{lang === 'en' ? 'Professional Title' : 'Judul Profesional'}</Label>
                          <Input
                            id="title"
                            value={formData.personalInfo.title}
                            onChange={(e) => handleInputChange("personalInfo", "title", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. Software Engineer' : 'cth. Insinyur Perangkat Lunak'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{lang === 'en' ? 'Email' : 'Surel'}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.personalInfo.email}
                            onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. john.doe@email.com' : 'cth. budi@email.com'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{lang === 'en' ? 'Phone' : 'Telepon'}</Label>
                          <Input
                            id="phone"
                            value={formData.personalInfo.phone}
                            onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. (123) 456-7890' : 'cth. 0812-3456-7890'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">{lang === 'en' ? 'Location' : 'Lokasi'}</Label>
                          <Input
                            id="location"
                            value={formData.personalInfo.location}
                            onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. New York, NY' : 'cth. Jakarta, Indonesia'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={formData.personalInfo.linkedin || ''}
                            onChange={(e) => handleInputChange("personalInfo", "linkedin", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. https://linkedin.com/in/yourprofile' : 'cth. https://linkedin.com/in/profilanda'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={formData.personalInfo.github || ''}
                            onChange={(e) => handleInputChange("personalInfo", "github", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. https://github.com/yourusername' : 'cth. https://github.com/namaanda'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={formData.personalInfo.instagram || ''}
                            onChange={(e) => handleInputChange("personalInfo", "instagram", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. https://instagram.com/yourusername' : 'cth. https://instagram.com/namaanda'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="additionalLink">{lang === 'en' ? 'Additional Link' : 'Link Tambahan'}</Label>
                          <Input
                            id="additionalLink"
                            value={formData.personalInfo.additionalLink || ''}
                            onChange={(e) => handleInputChange("personalInfo", "additionalLink", e.target.value)}
                            placeholder={lang === 'en' ? 'e.g. https://yourwebsite.com' : 'cth. https://websiteanda.com'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">{lang === 'en' ? 'Professional Summary' : 'Ringkasan Profesional'}</Label>
                        <Textarea
                          id="summary"
                          rows={4}
                          value={formData.personalInfo.summary}
                          onChange={(e) => handleInputChange("personalInfo", "summary", e.target.value)}
                          placeholder={lang === 'en' ? 'Brief summary about yourself, skills, and goals' : 'Ringkasan singkat tentang diri Anda, keahlian, dan tujuan'}
                        />
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{lang === 'en' ? 'Work Experience' : 'Pengalaman Kerja'}</h3>
                        <Button variant="outline" size="sm" onClick={() => addItem("experience")}>{lang === 'en' ? 'Add Experience' : 'Tambah Pengalaman'}</Button>
                      </div>
                      {formData.experience.map((exp, index) => (
                        <Card key={exp.id} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive"
                              onClick={() => removeItem("experience", exp.id)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company-${exp.id}`}>{lang === 'en' ? 'Company' : 'Perusahaan'}</Label>
                              <Input
                                id={`company-${exp.id}`}
                                value={exp.company}
                                onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. Tech Solutions Inc.' : 'cth. Tech Solutions Inc.'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`position-${exp.id}`}>{lang === 'en' ? 'Position' : 'Posisi'}</Label>
                              <Input
                                id={`position-${exp.id}`}
                                value={exp.position}
                                onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. Senior Software Engineer' : 'cth. Insinyur Perangkat Lunak Senior'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${exp.id}`}>{lang === 'en' ? 'Start Date' : 'Tanggal Mulai'}</Label>
                              <Input
                                id={`startDate-${exp.id}`}
                                value={exp.startDate}
                                onChange={(e) => handleArrayChange("experience", index, "startDate", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. Jan 2020' : 'cth. Jan 2020'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${exp.id}`}>{lang === 'en' ? 'End Date' : 'Tanggal Selesai'}</Label>
                              <Input
                                id={`endDate-${exp.id}`}
                                value={exp.endDate}
                                onChange={(e) => handleArrayChange("experience", index, "endDate", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. Present' : 'cth. Sekarang'}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor={`description-${exp.id}`}>{lang === 'en' ? 'Description' : 'Deskripsi'}</Label>
                            <Textarea
                              id={`description-${exp.id}`}
                              rows={3}
                              value={exp.description}
                              onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)}
                              placeholder={lang === 'en' ? 'Describe your responsibilities and achievements' : 'Jelaskan tanggung jawab dan pencapaian Anda'}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{lang === 'en' ? 'Education' : 'Pendidikan'}</h3>
                        <Button variant="outline" size="sm" onClick={() => addItem("education")}>
                          {lang === 'en' ? 'Add Education' : 'Tambah Pendidikan'}
                        </Button>
                      </div>

                      {formData.education.map((edu, index) => (
                        <Card key={edu.id} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Education {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive"
                              onClick={() => removeItem("education", edu.id)}
                            >
                              {lang === 'en' ? 'Remove' : 'Hapus'}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`institution-${edu.id}`}>{lang === 'en' ? 'Institution' : 'Institusi'}</Label>
                              <Input
                                id={`institution-${edu.id}`}
                                value={edu.institution}
                                onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. University of Technology' : 'cth. Universitas Teknologi'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${edu.id}`}>{lang === 'en' ? 'Degree' : 'Gelar'}</Label>
                              <Input
                                id={`degree-${edu.id}`}
                                value={edu.degree}
                                onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. Master of Computer Science' : 'cth. Magister Ilmu Komputer'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`eduStartDate-${edu.id}`}>{lang === 'en' ? 'Start Date' : 'Tanggal Mulai'}</Label>
                              <Input
                                id={`eduStartDate-${edu.id}`}
                                value={edu.startDate}
                                onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. 2015' : 'cth. 2015'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`eduEndDate-${edu.id}`}>{lang === 'en' ? 'End Date' : 'Tanggal Selesai'}</Label>
                              <Input
                                id={`eduEndDate-${edu.id}`}
                                value={edu.endDate}
                                onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. 2017' : 'cth. 2017'}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`gpa-${edu.id}`}>{lang === 'en' ? 'CGPA' : 'IPK'}</Label>
                              <Input
                                id={`gpa-${edu.id}`}
                                value={edu.gpa || ''}
                                onChange={(e) => handleArrayChange("education", index, "gpa", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. 3.85/4.00' : 'cth. 3.85/4.00'}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor={`eduDescription-${edu.id}`}>{lang === 'en' ? 'Description' : 'Deskripsi'}</Label>
                            <Textarea
                              id={`eduDescription-${edu.id}`}
                              rows={3}
                              value={edu.description}
                              onChange={(e) => handleArrayChange("education", index, "description", e.target.value)}
                              placeholder={lang === 'en' ? 'Describe your major, honors, or relevant coursework' : 'Jelaskan jurusan, penghargaan, atau mata kuliah yang relevan'}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{lang === 'en' ? 'Skills' : 'Keahlian'}</h3>
                        <Button variant="outline" size="sm" onClick={addSkill}>
                          {lang === 'en' ? 'Add Skill' : 'Tambah Keahlian'}
                        </Button>
                      </div>

                      <Card className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. JavaScript, Project Management' : 'cth. JavaScript, Manajemen Proyek'}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeSkill(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Portfolio */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{lang === 'en' ? 'Portfolio' : 'Portofolio'}</h3>
                        <Button variant="outline" size="sm" onClick={() => addItem("portfolio")}>
                          {lang === 'en' ? 'Add Portfolio' : 'Tambah Portofolio'}
                        </Button>
                      </div>

                      {formData.portfolio.map((portfolio, index) => (
                        <Card key={portfolio.id} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Portfolio {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive"
                              onClick={() => removeItem("portfolio", portfolio.id)}
                            >
                              {lang === 'en' ? 'Remove' : 'Hapus'}
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`portfolioTitle-${portfolio.id}`}>{lang === 'en' ? 'Project Title' : 'Judul Proyek'}</Label>
                              <Input
                                id={`portfolioTitle-${portfolio.id}`}
                                value={portfolio.title}
                                onChange={(e) => handleArrayChange("portfolio", index, "title", e.target.value)}
                                placeholder={lang === 'en' ? 'e.g. E-commerce Website' : 'cth. Website E-commerce'}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`portfolioImage-${portfolio.id}`}>{lang === 'en' ? 'Project Image' : 'Gambar Proyek'}</Label>
                                <Input
                                  id={`portfolioImage-${portfolio.id}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        if (ev.target?.result) {
                                          handleArrayChange("portfolio", index, "imageUrl", ev.target.result as string);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`portfolioLink-${portfolio.id}`}>{lang === 'en' ? 'Project Link' : 'Link Proyek'}</Label>
                                <Input
                                  id={`portfolioLink-${portfolio.id}`}
                                  value={portfolio.link || ''}
                                  onChange={(e) => handleArrayChange("portfolio", index, "link", e.target.value)}
                                  placeholder={lang === 'en' ? 'e.g. https://myproject.com' : 'cth. https://proyeksaya.com'}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`portfolioDescription-${portfolio.id}`}>{lang === 'en' ? 'Description' : 'Deskripsi'}</Label>
                              <Textarea
                                id={`portfolioDescription-${portfolio.id}`}
                                rows={3}
                                value={portfolio.description}
                                onChange={(e) => handleArrayChange("portfolio", index, "description", e.target.value)}
                                placeholder={lang === 'en' ? 'Describe the project, technologies used, and your role' : 'Jelaskan proyek, teknologi yang digunakan, dan peran Anda'}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-4 md:hidden">
                  <div className="border rounded-md p-4 bg-white overflow-x-auto">
                    <div className="w-full min-w-[320px]" ref={resumeRef}>
                      {renderTemplate()}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Preview Section (visible on large screens) - Fixed */}
          <div className="hidden md:block">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </h3>
              <div className="border rounded-md p-4 bg-white overflow-auto h-[calc(100%-8rem)]">
                <div className="w-full min-w-[320px]" ref={resumeRef}>
                  {renderTemplate()}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button onClick={generatePDF} className="gap-2 bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
