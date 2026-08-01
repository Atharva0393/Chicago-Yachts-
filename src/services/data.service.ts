import { Yacht, CompanyInfo, Experience, FAQ, Testimonial, Booking, Customer } from "@/types";
import { companyInfo as initialCompanyInfo } from "@/data/company";
import { experiences as initialExperiences } from "@/data/experiences";
import { faqs as initialFaqs } from "@/data/faqs";
import { testimonials as initialTestimonials } from "@/data/testimonials";
import { yachts as initialYachts } from "@/data/yachts";

class DataService {
  private _yachts: Yacht[] = [...initialYachts];
  private _companyInfo: CompanyInfo = { ...initialCompanyInfo };
  private _experiences: Experience[] = [...initialExperiences];
  private _faqs: FAQ[] = [...initialFaqs];
  private _testimonials: Testimonial[] = [...initialTestimonials];
  
  // Seed with some mock bookings and customers for the dashboard
  private _customers: Customer[] = [
    { id: "c1", name: "Sarah Jenkins", email: "sarah@example.com", phone: "(312) 555-0192", status: "CONVERTED", notes: [{ id: "n1", content: "Prefers morning charters", author: "System", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }], activities: [], tags: ["VIP", "Repeat"], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "c2", name: "Michael Chang", email: "m.chang@example.com", phone: "(312) 555-4421", status: "QUALIFIED", notes: [], activities: [], tags: ["Corporate"], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "c3", name: "David Miller", email: "david.m@example.com", phone: "(312) 555-8832", status: "CONVERTED", notes: [], activities: [], tags: [], createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: "c4", name: "Emily Watson", email: "emily.w@example.com", phone: "(312) 555-1122", status: "LEAD", notes: [{ id: "n2", content: "Inquired about bachelorette party", author: "Admin", createdAt: new Date().toISOString() }], activities: [], tags: ["Bachelorette"], createdAt: new Date().toISOString() },
    { id: "c5", name: "James Wilson", email: "j.wilson@example.com", phone: "(312) 555-9988", status: "CONTACTED", notes: [], activities: [], tags: [], createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  ];

  private _bookings: Booking[] = [
    { id: "b1", yachtId: "34-ft-rinker-fiesta-vee-yacht", customerId: "c1", date: new Date(Date.now() + 86400000 * 3).toISOString(), timeSlot: "Afternoon (12:00 PM - 4:00 PM)", duration: 4, guests: 8, totalPrice: 960, status: "CONFIRMED", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "b2", yachtId: "46-ft-sea-ray-prestige-yacht", customerId: "c2", date: new Date(Date.now() + 86400000 * 5).toISOString(), timeSlot: "Evening (5:00 PM - 9:00 PM)", duration: 4, guests: 12, totalPrice: 1280, status: "PENDING", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: "b3", yachtId: "37-ft-sea-ray-drift-yacht", customerId: "c3", date: new Date(Date.now() - 86400000 * 1).toISOString(), timeSlot: "Morning (8:00 AM - 12:00 PM)", duration: 4, guests: 6, totalPrice: 1200, status: "COMPLETED", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  ];

  // --- YACHTS ---
  async getYachts(): Promise<Yacht[]> {
    return Promise.resolve([...this._yachts]);
  }
  
  async getYacht(idOrSlug: string): Promise<Yacht | null> {
    const yacht = this._yachts.find(y => y.id === idOrSlug || y.slug === idOrSlug);
    return Promise.resolve(yacht ? { ...yacht } : null);
  }

  async createYacht(data: Omit<Yacht, "id" | "slug">): Promise<Yacht> {
    const id = crypto.randomUUID();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newYacht: Yacht = { ...data, id, slug };
    this._yachts.push(newYacht);
    return Promise.resolve({ ...newYacht });
  }

  async updateYacht(id: string, data: Partial<Yacht>): Promise<Yacht | null> {
    const index = this._yachts.findIndex(y => y.id === id);
    if (index === -1) return Promise.resolve(null);
    this._yachts[index] = { ...this._yachts[index], ...data };
    return Promise.resolve({ ...this._yachts[index] });
  }

  async deleteYacht(id: string): Promise<boolean> {
    const initialLength = this._yachts.length;
    this._yachts = this._yachts.filter(y => y.id !== id);
    return Promise.resolve(this._yachts.length < initialLength);
  }

  // --- BOOKINGS ---
  async getBookings(): Promise<Booking[]> {
    const populated = this._bookings.map(b => ({
      ...b,
      customer: this._customers.find(c => c.id === b.customerId),
      yacht: this._yachts.find(y => y.id === b.yachtId),
    }));
    return Promise.resolve(populated);
  }

  async updateBookingStatus(id: string, status: Booking["status"]): Promise<Booking | null> {
    const index = this._bookings.findIndex(b => b.id === id);
    if (index === -1) return Promise.resolve(null);
    this._bookings[index].status = status;
    return Promise.resolve({ ...this._bookings[index] });
  }

  // --- CUSTOMERS ---
  async getCustomers(): Promise<Customer[]> {
    return Promise.resolve([...this._customers]);
  }

  async updateCustomerStatus(id: string, status: Customer["status"]): Promise<Customer | null> {
    const index = this._customers.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    this._customers[index].status = status;
    return Promise.resolve({ ...this._customers[index] });
  }

  async addCustomerNote(id: string, content: string, author: string = "Admin"): Promise<Customer | null> {
    const index = this._customers.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    if (!this._customers[index].notes) this._customers[index].notes = [];
    this._customers[index].notes!.push({
      id: crypto.randomUUID(),
      content,
      author,
      createdAt: new Date().toISOString()
    });
    return Promise.resolve({ ...this._customers[index] });
  }

  async addCustomerActivity(id: string, type: any, description: string): Promise<Customer | null> {
    const index = this._customers.findIndex(c => c.id === id);
    if (index === -1) return Promise.resolve(null);
    if (!this._customers[index].activities) this._customers[index].activities = [];
    this._customers[index].activities!.push({
      id: crypto.randomUUID(),
      type,
      description,
      createdAt: new Date().toISOString()
    });
    return Promise.resolve({ ...this._customers[index] });
  }

  // --- OTHERS (Read-Only for now) ---
  async getCompanyInfo(): Promise<CompanyInfo> {
    return Promise.resolve(this._companyInfo);
  }
  async getExperiences(): Promise<Experience[]> {
    return Promise.resolve([...this._experiences]);
  }
  async getExperience(id: string): Promise<Experience | null> {
    const exp = this._experiences.find(e => e.id === id);
    return Promise.resolve(exp ? { ...exp } : null);
  }
  async getFAQs(): Promise<FAQ[]> {
    return Promise.resolve([...this._faqs]);
  }
  async getTestimonials(): Promise<Testimonial[]> {
    return Promise.resolve([...this._testimonials]);
  }
}

const globalForDataService = globalThis as unknown as { dataService: DataService };
export const dataService = globalForDataService.dataService || new DataService();

if (process.env.NODE_ENV !== "production") {
  globalForDataService.dataService = dataService;
}
