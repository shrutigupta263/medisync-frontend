import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Smartphone, Mail, Lock, Globe, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUserDisplayName, getUserInitials } from '@/lib/user-utils';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    language: 'en',
    timezone: 'America/New_York',
  });

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      const fullName = getUserDisplayName(user);
      const nameParts = fullName.split(' ');
      
      setProfile(prev => ({
        ...prev,
        firstName: user.user_metadata?.firstName || nameParts[0] || '',
        lastName: user.user_metadata?.lastName || nameParts.slice(1).join(' ') || '',
        fullName: fullName,
        email: user.email || '',
      }));
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    emailReports: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyDigest: true,
    appointmentReminders: true,
    familyUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    shareWithFamily: true,
    shareWithDoctors: true,
    anonymousAnalytics: false,
    dataExport: true,
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      
      const { user: updatedUser, error } = await updateUser({
        name: fullName
      });
      
      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
        
        // Update local state
        setProfile(prev => ({ ...prev, fullName }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline">Change Photo</Button>
              <p className="text-sm text-muted-foreground">
                Upload a new profile photo. JPG, PNG or GIF (max 2MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={profile.language} onValueChange={(value) => handleProfileChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose how you want to be notified about updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive new medical reports via email
                </p>
              </div>
              <Switch
                checked={notifications.emailReports}
                onCheckedChange={(checked) => handleNotificationChange('emailReports', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications on your devices
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive urgent alerts via text message
                </p>
              </div>
              <Switch
                checked={notifications.smsAlerts}
                onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Health Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your health data
                </p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders for upcoming appointments
                </p>
              </div>
              <Switch
                checked={notifications.appointmentReminders}
                onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Family Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about family members' health updates
                </p>
              </div>
              <Switch
                checked={notifications.familyUpdates}
                onCheckedChange={(checked) => handleNotificationChange('familyUpdates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Manage your security settings and data privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Button variant="outline" className="mb-2">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Button variant="outline" className="mb-2">
                <Smartphone className="mr-2 h-4 w-4" />
                Two-Factor Authentication
              </Button>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Data Sharing Preferences</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Share with Family</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow family members to view your health summary
                  </p>
                </div>
                <Switch
                  checked={privacy.shareWithFamily}
                  onCheckedChange={(checked) => handlePrivacyChange('shareWithFamily', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Share with Healthcare Providers</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your doctors to access your health records
                  </p>
                </div>
                <Switch
                  checked={privacy.shareWithDoctors}
                  onCheckedChange={(checked) => handlePrivacyChange('shareWithDoctors', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Anonymous Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve MediSync with anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={privacy.anonymousAnalytics}
                  onCheckedChange={(checked) => handlePrivacyChange('anonymousAnalytics', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Data Export & Deletion</h4>
              <div className="flex gap-2">
                <Button variant="outline">
                  Export My Data
                </Button>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Delete Account
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Download all your data or permanently delete your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}