import React from 'react';
import { Shield, ArrowLeft, ExternalLink, Eye, Database, Globe, Lock } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const lastUpdated = "January 9, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
                  <p className="text-blue-100 text-sm">Last updated: {lastUpdated}</p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Company Information:</strong> This privacy policy applies to Nationbuilder.pro LLC (in formation), 
                  a Virginia limited liability company in formation, operating the Nationbuilder application and website.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Email address (required for account creation and communication)</li>
                <li>Username (public identifier)</li>
                <li>City and country (for demographic analysis)</li>
                <li>Age (for age verification and demographic analysis)</li>
                <li>Password (encrypted and stored securely)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Application Data</h3>
              <p className="text-gray-700 mb-4">
                When you use our nation-building features, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Nation assessment responses and configurations</li>
                <li>Custom policy text and modifications</li>
                <li>Saved nation data and metadata</li>
                <li>Leaderboard participation preferences</li>
                <li>Privacy settings and preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Usage Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Session duration and activity patterns</li>
                <li>Feature usage statistics</li>
                <li>Browser type and device information</li>
                <li>IP address and general location</li>
                <li>Error logs and performance metrics</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Third-Party Integrations & Data Sharing</h2>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Service</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Data Shared</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Supabase</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Database hosting, authentication, real-time features</td>
                      <td className="border border-gray-300 px-4 py-2">All user data, nation data, session information</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Policy</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Stripe</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Payment processing, subscription management</td>
                      <td className="border border-gray-300 px-4 py-2">Email, payment information, subscription status</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Policy</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Pexels</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Stock photography for UI elements</td>
                      <td className="border border-gray-300 px-4 py-2">No user data shared (images loaded directly)</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://www.pexels.com/privacy-policy/" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Policy</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Netlify</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Web hosting and content delivery</td>
                      <td className="border border-gray-300 px-4 py-2">IP address, browser information, usage analytics</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>View Policy</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use the following cookies and local storage:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li><strong>Authentication cookies:</strong> To maintain your login session</li>
                <li><strong>Preference cookies:</strong> To remember your privacy settings and preferences</li>
                <li><strong>Session storage:</strong> For temporary data during nation building</li>
                <li><strong>Local storage:</strong> For session management and offline functionality</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Provide and improve our nation-building services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Generate leaderboards and community features</li>
                <li>Send important account and service notifications</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-6">
                We retain your data as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li><strong>Account data:</strong> Until account deletion or 3 years of inactivity</li>
                <li><strong>Nation data:</strong> Until manually deleted by user or account closure</li>
                <li><strong>Payment data:</strong> 7 years for tax and legal compliance</li>
                <li><strong>Usage logs:</strong> 2 years for security and analytics</li>
                <li><strong>Temporary data:</strong> 24 hours for session-based nations</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights (GDPR & CCPA Compliance)</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw consent:</strong> Revoke consent for data processing</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy Controls</h2>
              <p className="text-gray-700 mb-4">
                You can control your privacy through:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Privacy settings in your user profile</li>
                <li>Leaderboard visibility controls</li>
                <li>Nation sharing preferences</li>
                <li>Email notification settings</li>
                <li>Account deletion options</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your data may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place, including Standard Contractual Clauses 
                and adequacy decisions where applicable.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Security Measures</h2>
              <p className="text-gray-700 mb-6">
                We implement industry-standard security measures including encryption at rest and in transit, 
                regular security audits, access controls, and monitoring systems to protect your data.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware of such collection, we will delete 
                the information immediately.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by email and by posting the updated policy on our website with a new effective date.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-2">
                  <strong>Data Controller:</strong> J. Neelbauer
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}