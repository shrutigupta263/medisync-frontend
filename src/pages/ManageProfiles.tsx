import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Crown, Baby, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  isOwner: boolean;
  avatar?: string;
  medicalConditions?: string[];
  allergies?: string[];
}

const initialFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    relationship: 'Self',
    dateOfBirth: '1990-01-15',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    isOwner: true,
    medicalConditions: ['Hypertension'],
    allergies: ['Penicillin']
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    relationship: 'Spouse',
    dateOfBirth: '1992-05-20',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4568',
    isOwner: false,
    medicalConditions: [],
    allergies: ['Shellfish']
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Doe',
    relationship: 'Daughter',
    dateOfBirth: '2015-08-10',
    isOwner: false,
    medicalConditions: ['Asthma'],
    allergies: []
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Doe',
    relationship: 'Son',
    dateOfBirth: '2018-03-25',
    isOwner: false,
    medicalConditions: [],
    allergies: ['Peanuts']
  }
];

export default function ManageProfiles() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  });

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'self':
        return <Crown className="h-4 w-4 text-primary" />;
      case 'spouse':
      case 'partner':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'son':
      case 'daughter':
      case 'child':
        return <Baby className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleAddMember = () => {
    if (newMember.firstName && newMember.lastName && newMember.relationship && newMember.dateOfBirth) {
      const id = Date.now().toString();
      setFamilyMembers([...familyMembers, { 
        ...newMember as FamilyMember, 
        id, 
        isOwner: false,
        medicalConditions: [],
        allergies: []
      }]);
      setNewMember({
        firstName: '',
        lastName: '',
        relationship: '',
        dateOfBirth: '',
        email: '',
        phone: '',
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
  };

  const handleDeleteMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Family Profiles</h1>
          <p className="text-muted-foreground">Manage your family members' health profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Add a new family member to manage their health records
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newMember.firstName || ''}
                    onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newMember.lastName || ''}
                    onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select 
                  value={newMember.relationship || ''} 
                  onValueChange={(value) => setNewMember({...newMember, relationship: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="son">Son</SelectItem>
                    <SelectItem value="daughter">Daughter</SelectItem>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newMember.dateOfBirth || ''}
                  onChange={(e) => setNewMember({...newMember, dateOfBirth: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email || ''}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={newMember.phone || ''}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Family Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyMembers.length}</div>
            <p className="text-xs text-muted-foreground">Family profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adults</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {familyMembers.filter(member => calculateAge(member.dateOfBirth) >= 18).length}
            </div>
            <p className="text-xs text-muted-foreground">18+ years old</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {familyMembers.filter(member => calculateAge(member.dateOfBirth) < 18).length}
            </div>
            <p className="text-xs text-muted-foreground">Under 18 years</p>
          </CardContent>
        </Card>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.isOwner && (
                      <Badge variant="outline" className="text-primary border-primary">
                        Owner
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getRelationshipIcon(member.relationship)}
                    <span>{member.relationship}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {calculateAge(member.dateOfBirth)} years
                </div>
                <div>
                  <span className="font-medium">Born:</span> {member.dateOfBirth}
                </div>
                {member.email && (
                  <div>
                    <span className="font-medium">Email:</span> {member.email}
                  </div>
                )}
                {member.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {member.phone}
                  </div>
                )}
              </div>

              {/* Medical Conditions & Allergies */}
              <div className="space-y-3">
                {member.medicalConditions && member.medicalConditions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Medical Conditions</div>
                    <div className="flex flex-wrap gap-1">
                      {member.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {member.allergies && member.allergies.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Allergies</div>
                    <div className="flex flex-wrap gap-1">
                      {member.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditMember(member)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {!member.isOwner && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}