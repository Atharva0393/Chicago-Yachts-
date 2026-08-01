import { useState, useEffect } from "react";
import { dataService } from "@/services/data.service";
import { Yacht, CompanyInfo, Experience, FAQ, Testimonial } from "@/types";
import { getAllYachtsAction } from "@/server/actions/yacht.actions";

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
    dataService.getCompanyInfo().then((data) => {
      setCompanyInfo(data);
      setLoading(false);
    });
  }, []);

  return { companyInfo, loading };
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  return { experiences, loading };
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getFAQs().then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  return { faqs, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getTestimonials().then((data) => {
      setTestimonials(data);
      setLoading(false);
    });
  }, []);

  return { testimonials, loading };
}
