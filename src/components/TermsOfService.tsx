import React from 'react';
import { Scale, ArrowLeft, ExternalLink, AlertTriangle, CreditCard } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
  const lastUpdated = "January 9, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Scale className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
                  <p className="text-purple-100 text-sm">Last updated: {lastUpdated}</p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-800 text-sm">
                  <strong>Service Provider:</strong> These terms govern your use of Nationbuilder, operated by 
                  Nationbuilder.pro LLC (in formation), a Virginia limited liability company in formation.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing or using Nationbuilder ("the Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of these terms, you may not access the Service. 
                These Terms apply to all visitors, users, and others who access or use the Service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Nationbuilder is an AI-powered nation-building simulation platform that allows users to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Create and customize virtual nations with various governance systems</li>
                <li>Generate AI-powered analysis and recommendations</li>
                <li>Download constitutional documents and policy frameworks</li>
                <li>Participate in community leaderboards and comparisons</li>
                <li>Save and share nation configurations</li>
                <li>Access premium features through subscription plans</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features, you must create an account by providing:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>A valid email address</li>
                <li>A unique username</li>
                <li>Your city and country of residence</li>
                <li>Your age (must be 13 or older)</li>
                <li>A secure password</li>
              </ul>
              <p className="text-gray-700 mb-6">
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account. You must immediately notify us of any unauthorized 
                use of your account.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Subscription Plans and Billing</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">Free Tier</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Create unlimited nation assessments</li>
                <li>Save up to 5 nations</li>
                <li>Access basic leaderboards (top 5 in each category)</li>
                <li>Download constitutional documents</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Nationleader Subscription ($2.99/month)</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Save up to 30 nations</li>
                <li>Access full leaderboards (top 30 in each category)</li>
                <li>Early access to new features</li>
                <li>Priority support</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 mb-1">Billing Terms:</p>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• Subscriptions are billed monthly in advance</li>
                      <li>• Automatic renewal unless cancelled</li>
                      <li>• No refunds for partial months</li>
                      <li>• Cancellation takes effect at end of billing period</li>
                      <li>• Price changes require 30 days notice</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our Service integrates with the following third-party services, each governed by their own terms:
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Service</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Terms of Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Supabase</td>
                      <td className="border border-gray-300 px-4 py-2">Database and authentication services</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://supabase.com/terms" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Terms</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Stripe</td>
                      <td className="border border-gray-300 px-4 py-2">Payment processing and subscription management</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://stripe.com/legal/ssa" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Terms</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Netlify</td>
                      <td className="border border-gray-300 px-4 py-2">Web hosting and content delivery</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://www.netlify.com/legal/terms-of-use/" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Terms</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Pexels</td>
                      <td className="border border-gray-300 px-4 py-2">Stock photography for user interface</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://www.pexels.com/terms-of-service/" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Terms</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. User Content and Conduct</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">Acceptable Use</h3>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Create content that is illegal, harmful, threatening, or discriminatory</li>
                <li>Impersonate others or provide false information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for commercial purposes without permission</li>
                <li>Share content that violates intellectual property rights</li>
                <li>Engage in spam, harassment, or abusive behavior</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Content Ownership</h3>
              <p className="text-gray-700 mb-6">
                You retain ownership of the content you create (nation configurations, custom policies, etc.). 
                By using our Service, you grant us a non-exclusive, worldwide license to use, store, and 
                display your content as necessary to provide the Service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The Service and its original content, features, and functionality are owned by Nationbuilder.pro LLC 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Our collection and use of personal information is governed by 
                our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, 
                you consent to the collection and use of information as described in our Privacy Policy.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 mb-2">Important Disclaimers:</p>
                    <ul className="text-red-800 text-sm space-y-1">
                      <li>• The Service is provided "as is" without warranties of any kind</li>
                      <li>• AI-generated content is for educational and entertainment purposes only</li>
                      <li>• We do not guarantee accuracy of historical comparisons or predictions</li>
                      <li>• Constitutional documents are templates, not legal advice</li>
                      <li>• Service availability may be interrupted for maintenance or technical issues</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                To the maximum extent permitted by law, Nationbuilder.pro LLC shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of 
                the Service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700 mb-6">
                You agree to defend, indemnify, and hold harmless Nationbuilder.pro LLC and its officers, 
                directors, employees, and agents from and against any claims, damages, obligations, losses, 
                liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and access to the Service immediately, without prior 
                notice, for conduct that we believe violates these Terms or is harmful to other users, us, or 
                third parties, or for any other reason in our sole discretion.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the Commonwealth 
                of Virginia, without regard to its conflict of law provisions. Any disputes arising under these 
                Terms shall be resolved in the courts of Virginia.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any material 
                changes by email and by posting the updated Terms on our website. Your continued use of the 
                Service after such modifications constitutes acceptance of the updated Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-2">
                  <strong>Company Representative:</strong> J. Neelbauer
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Company:</strong> Nationbuilder.pro LLC (in formation), a Virginia limited liability company in formation
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> <a href="mailto:nationbuilderpro@gmail.com" className="text-blue-600 hover:text-blue-700">nationbuilderpro@gmail.com</a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> <a href="tel:+15712660008" className="text-blue-600 hover:text-blue-700">(571) 266-0008</a>
                </p>
                <p className="text-gray-700">
                  <strong>Mailing Address:</strong><br />
                  Nationbuilder Pro c/o J Neelbauer<br />
                  1069 W. Broad St., Ste 111<br />
                  Falls Church, VA 22046
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Effective Date:</strong> These Terms of Service are effective as of {lastUpdated} and 
                  will remain in effect except with respect to any changes in their provisions in the future, 
                  which will be in effect immediately after being posted on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}