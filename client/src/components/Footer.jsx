import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'About',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Help & Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Community', href: '/community' },
        { name: 'Trust & Safety', href: '/safety' }
      ]
    },
    {
      title: 'Jobs by Category',
      links: [
        { name: 'Technology', href: '/jobs/technology' },
        { name: 'Marketing', href: '/jobs/marketing' },
        { name: 'Sales', href: '/jobs/sales' },
        { name: 'Design', href: '/jobs/design' }
      ]
    },
    {
      title: 'Recruiters',
      links: [
        { name: 'Post a Job', href: '/jobs/post' },
        { name: 'Recruiting Solutions', href: '/recruiting' },
        { name: 'Employer Branding', href: '/employer-branding' },
        { name: 'Talent Search', href: '/talent-search' }
      ]
    },
    {
      title: 'Policies',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/capsnet', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/capsnet', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/capsnet', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/capsnet', color: 'hover:text-pink-600' }
  ]

  return (
    <footer className='mt-16 border-t bg-bg-secondary border-border'>
      <div className='px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-5'>
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className='mb-4 text-sm font-semibold tracking-wider uppercase text-text-primary'>
                {section.title}
              </h3>
              <ul className='space-y-3'>
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (linkIndex * 0.05) }}
                  >
                    <Link
                      to={link.href}
                      className='flex items-center text-sm transition-colors duration-200 text-text-secondary hover:text-primary group'
                    >
                      <span className='transition-transform duration-200 group-hover:translate-x-1'>
                        {link.name}
                      </span>
                      <ExternalLink className='w-3 h-3 ml-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100' />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          className='pt-8 mb-8 border-t border-border'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <Mail className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium text-text-primary'>Email Us</p>
                <p className='text-sm text-text-secondary'>Jay708103@gmail.com</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <Phone className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium text-text-primary'>Call Us</p>
                <p className='text-sm text-text-secondary'>+91 9302510025</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <MapPin className='w-4 h-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium text-text-primary'>Visit Us</p>
                <p className='text-sm text-text-secondary'>12 JA</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Media & Newsletter */}
        <motion.div
          className='pt-8 mb-8 border-t border-border'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div>
              <h4 className='mb-2 font-semibold text-text-primary'>Follow Us</h4>
              <div className='flex gap-4'>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`p-2 rounded-lg bg-bg-primary text-text-secondary ${social.color} transition-all duration-200 hover:scale-110`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Icon className='w-5 h-5' />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            <div className='text-center md:text-right'>
              <h4 className='mb-2 font-semibold text-text-primary'>Stay Updated</h4>
              <p className='mb-3 text-sm text-text-secondary'>Get the latest job opportunities and platform updates</p>
              <div className='flex max-w-sm gap-2'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 text-sm modern-input'
                />
                <motion.button
                  className='px-4 py-2 text-sm font-medium text-white modern-button whitespace-nowrap'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className='flex flex-col items-center justify-between gap-4 pt-6 border-t border-border md:flex-row'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className='flex items-center gap-4'>
            <Link to='/' className='flex items-center gap-2'>
              <motion.div
                className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary'
                whileHover={{ rotate: 10 }}
              >
                <span className='text-sm font-bold text-white'>P</span>
              </motion.div>
              <span className='font-bold text-text-primary'>Capsnet</span>
            </Link>
            <span className='text-sm text-text-secondary'>•</span>
            <p className='text-sm text-text-secondary'>
              © 2025 Capsnet. All rights reserved.
            </p>
          </div>

          <div className='flex items-center gap-6 text-sm'>
            <Link to='/privacy' className='transition-colors text-text-secondary hover:text-primary'>
              Privacy
            </Link>
            <Link to='/terms' className='transition-colors text-text-secondary hover:text-primary'>
              Terms
            </Link>
            <Link to='/cookies' className='transition-colors text-text-secondary hover:text-primary'>
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mobile Accordion Footer (for very small screens) */}
      <div className='border-t border-border md:hidden'>
        <details className='group'>
          <summary className='flex items-center justify-between p-4 font-medium cursor-pointer text-text-primary'>
            Quick Links
            <motion.div
              className='transition-transform duration-200 group-open:rotate-180'
              initial={false}
            >
              ▼
            </motion.div>
          </summary>
          <div className='px-4 pb-4 space-y-2'>
            {footerSections.slice(0, 3).map((section) =>
              section.links.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className='block py-1 text-sm transition-colors text-text-secondary hover:text-primary'
                >
                  {link.name}
                </Link>
              ))
            )}
          </div>
        </details>
      </div>
    </footer>
  )
}

export default Footer
