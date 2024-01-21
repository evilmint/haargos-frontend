import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useContactStore } from '@/app/services/stores/contact';
import { FailureAlert } from '@/components/ui/failure-alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/registry/new-york/ui/form';
import { Input } from '@/registry/new-york/ui/input';
import { Textarea } from '@/registry/new-york/ui/textarea'; // Assuming you have a Textarea component similar to Input
import { PrimaryButton } from './primary-button';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(1, 'Please enter your message.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const contact = useContactStore(state => state.contact);
  const [sent, setSent] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setAlertOpen(false);

    try {
      await contact(data.name, data.email, data.message);
      setSent(true);
    } catch {
      setAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
            {/* Content for the first column if needed */}
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-white mb-6">
              Get in Touch
            </h2>

            {sent && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Thank you for contacting us! We will get back to you as soon as possible.
              </p>
            )}

            {!sent && (
              <>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Have questions? Our team is ready to help you!
                </p>
                <FailureAlert
                  title={'Failed to send message'}
                  openChange={setAlertOpen}
                  open={alertOpen}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Your Email" {...field} />
                            </FormControl>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                className="bg-white dark:bg-background"
                                placeholder="Your Message"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage>{fieldState.error?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <PrimaryButton className="w-[100%]" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </PrimaryButton>
                    </form>
                  </Form>
                </FailureAlert>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
