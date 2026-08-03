import { useState, useEffect } from "react";
import { Yacht, CompanyInfo, Experience, FAQ, Testimonial } from "@/types";
import { getAllYachtsAction } from "@/server/actions/yacht.actions";

// Static imports
import { companyInfo as companyData } from "@/lib/constants/company";
import { experiences as experiencesData } from "@/lib/constants/experiences";
import { faqs as faqsData } from "@/lib/constants/faqs";
import { testimonials as testimonialsData } from "@/lib/constants/testimonials";

export function useYachts() {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllYachtsAction().then((data) => {
      setYachts(data);
      setLoading(false);
    });
  }, []);

  return { yachts, loading };
}

export function useCompanyInfo() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCompanyInfo(companyData);
    setLoading(false);
  }, []);

  return { companyInfo, loading };
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExperiences(experiencesData);
    setLoading(false);
  }, []);

  return { experiences, loading };
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFaqs(faqsData);
    setLoading(false);
  }, []);

  return { faqs, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTestimonials(testimonialsData);
    setLoading(false);
  }, []);

  return { testimonials, loading };
}
