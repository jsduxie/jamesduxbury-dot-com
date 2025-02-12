import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, Button, Input, Textarea, DialogTitle } from "@/components/ui/ui";
import { Github, Linkedin } from "lucide-react";
import { CTAButton } from "./Components";

interface ContactModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }

const ContactModal: React.FC<ContactModalProps> = ({setOpen}) => {
    const [formData, setFormData] = useState({name: "", email: "", mobile: "", message: ""});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    interface ChangeEvent {
        target: {
            name: string;
            value: string;
        };
    }

    interface FormEvent {
        preventDefault: () => void;
    }

    const handleChange = (e: ChangeEvent) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Message sent successfully!");
            setOpen(false);
            setFormData({name: "", email: "", mobile: "", message: ""});
            setSuccess(true);
        } else {
            alert("An error occurred. Please try again later.");
        }

        setLoading(false);
    }


    return (
        <Dialog>
          <DialogTrigger>
            <CTAButton name="Contact" onClick={() => setOpen(true)} />
          </DialogTrigger>
          <DialogContent className="max-w-md p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 flex-col align-center">
            <DialogTitle>Contact Me :)</DialogTitle>
            <div className="flex gap-4 mb-4 flex justify-center">
              <a href="https://github.com/jsduxie" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="flex gap-2">
                  <Github size={18} /> GitHub
                </Button>
              </a>
              <a href="https://linkedin.com/in/jamesduxbury03" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="flex gap-2">
                  <Linkedin size={18} /> LinkedIn
                </Button>
              </a>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <Textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
              <Button type="submit" className="w-full focus:shadow-[0_0_15px_#3182ce]" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
              {success && <p className="text-green-500">Message sent successfully!</p>}
            </form>
          </DialogContent>
        </Dialog>
      );
}

export default ContactModal;