
'use client';
import  AppLayout  from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { publicGovernancePoll } from '@/lib/data';

type PollSolution = {
  text: string;
};

type Poll = {
  title: string;
  description: string;
  solutions: PollSolution[];
};

const agreementLevels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

const internationalIssues: Poll[] = [
    publicGovernancePoll,
    {
        title: "Climate Change & Global Warming",
        description: "The long-term heating of Earth’s climate system observed since the pre-industrial period due to human activities, primarily fossil fuel burning.",
        solutions: [
            { text: "Accelerate transition to renewable energy sources (solar, wind, hydro)." },
            { text: "Implement a global carbon tax on corporations and nations." },
            { text: "Invest in carbon capture, utilization, and storage (CCUS) technology." },
            { text: "Promote sustainable agriculture and protect global forests." }
        ]
    },
    {
        title: "Pandemics & Global Health Security",
        description: "The risk of infectious diseases spreading globally, overwhelming health systems and causing widespread social and economic disruption.",
        solutions: [
            { text: "Strengthen the WHO with more funding and authority for pandemic response." },
            { text: "Establish a global real-time pathogen surveillance network." },
            { text: "Fund research for universal vaccines (e.g., for coronaviruses, influenza)." },
            { text: "Ensure equitable distribution of medical supplies and vaccines." }
        ]
    },
    {
        title: "Nuclear Proliferation & Disarmament",
        description: "The spread of nuclear weapons, fissionable material, and weapons-applicable nuclear technology to nations not recognized as 'Nuclear Weapon States'.",
        solutions: [
            { text: "Modernize and enforce the Non-Proliferation Treaty (NPT)." },
            { text: "Facilitate diplomatic talks between nuclear-armed states to reduce arsenals." },
            { text: "Increase funding for the International Atomic Energy Agency (IAEA) for inspections." }
        ]
    },
    {
        title: "Global Economic Instability",
        description: "The risk of major financial crises, trade wars, and sovereign debt defaults that can trigger a global recession.",
        solutions: [
            { text: "Coordinate central bank policies to manage inflation and prevent currency wars." },
            { text: "Reform the WTO to address modern trade disputes (e.g., digital trade)." },
            { text: "Create a sovereign debt restructuring mechanism to prevent defaults." }
        ]
    },
    {
        title: "Cybersecurity Threats & Cyber Warfare",
        description: "Malicious attacks on digital systems for political, criminal, or military purposes, targeting critical infrastructure and data.",
        solutions: [
            { text: "Establish international treaties defining rules of engagement for cyber warfare." },
            { text: "Create a global cybercrime agency to share threat intelligence." },
            { text: "Promote end-to-end encryption and open-source security software." }
        ]
    },
    {
        title: "Terrorism & Extremism",
        description: "The use of violence and intimidation by non-state actors to pursue political aims, often fueled by extremist ideologies.",
        solutions: [
            { text: "Disrupt terrorist financing networks through global financial monitoring." },
            { text: "Counter extremist propaganda online with educational and counter-narrative campaigns." },
            { text: "Address root causes like poverty, political instability, and lack of education." }
        ]
    },
    {
        title: "Food & Water Security",
        description: "Ensuring that all people, at all times, have physical, social, and economic access to sufficient, safe, and nutritious food and clean water.",
        solutions: [
            { text: "Invest in climate-resilient crops and smart irrigation technology." },
            { text: "Reduce food waste through better supply chain management." },
            { text: "Protect and restore freshwater ecosystems (rivers, wetlands)." },
            { text: "Fund large-scale, low-cost water purification and desalination projects." }
        ]
    },
    {
        title: "Mass Migration & Refugee Crises",
        description: "Large-scale movements of people fleeing conflict, persecution, or environmental disasters, placing strain on host nations.",
        solutions: [
            { text: "Address the root causes of displacement (conflict, climate change, poverty)." },
            { text: "Establish a fair and standardized international asylum processing system." },
            { text: "Increase funding for refugee camps and integration programs in host countries." }
        ]
    },
    {
        title: "Biodiversity Loss & Ecosystem Collapse",
        description: "The accelerating extinction of species and the degradation of ecosystems, which threatens nature's ability to provide clean air, water, and food.",
        solutions: [
            { text: "Expand protected areas to cover 30% of the planet's land and oceans by 2030." },
            { text: "Ban trade in endangered species and combat illegal poaching." },
            { text: "Promote regenerative agriculture and reforestation projects." }
        ]
    },
    {
        title: "Misinformation & Disinformation",
        description: "The deliberate or unintentional spread of false information, undermining trust in institutions, science, and media.",
        solutions: [
            { text: "Promote digital literacy and critical thinking education in schools." },
            { text: "Support independent, fact-checking organizations globally." },
            { text: "Hold social media platforms accountable for amplifying harmful disinformation." }
        ]
    },
    {
        title: "Wealth & Income Inequality",
        description: "The extreme concentration of wealth in a small fraction of the population, while billions struggle with basic needs.",
        solutions: [
            { text: "Implement a global minimum tax on multinational corporations." },
            { text: "Strengthen workers' rights to unionize and bargain for better wages." },
            { text: "Invest in universal access to quality education and healthcare." }
        ]
    },
    {
        title: "AI Ethics & Governance",
        description: "The challenge of ensuring artificial intelligence is developed and used in a way that is safe, ethical, and beneficial for humanity.",
        solutions: [
            { text: "Create an international agency for AI safety and ethics, similar to the IAEA for nuclear energy." },
            { text: "Mandate transparency and auditability for critical AI systems (e.g., in law, medicine)." },
            { text: "Ban the development and use of autonomous lethal weapons." }
        ]
    },
    {
        title: "Antimicrobial Resistance (AMR)",
        description: "The process where bacteria, viruses, fungi, and parasites evolve to no longer respond to medicines, making common infections deadly.",
        solutions:
        [
            { text: "Reduce the overuse of antibiotics in agriculture and human medicine." },
            { text: "Fund research into new classes of antibiotics and alternative treatments (e.g., phage therapy)." },
            { text: "Improve sanitation and hygiene in healthcare settings globally." }
        ]
    },
    {
        title: "Space Debris & Space Militarization",
        description: "The growing clutter of defunct satellites and rocket stages in orbit, and the placement of weapons in space.",
        solutions: [
            { text: "Develop and fund technology for actively removing large space debris." },
            { text: "Establish an international treaty banning anti-satellite weapons testing." },
            { text: "Mandate that all new satellites have a plan for de-orbiting at the end of their life." }
        ]
    },
    {
        title: "Global Mental Health Crisis",
        description: "The rising prevalence of mental health conditions like depression and anxiety, with insufficient resources to address them.",
        solutions: [
            { text: "Integrate mental healthcare into primary healthcare systems." },
            { text: "Launch global anti-stigma campaigns to normalize seeking help." },
            { text: "Invest in digital mental health tools and tele-therapy services." }
        ]
    }
];

function PollCard({ poll }: { poll: Poll }) {
  const [selectedSolutions, setSelectedSolutions] = useState<Record<string, string>>({});

  const handleCheckboxChange = (solutionText: string, checked: boolean | 'indeterminate') => {
    setSelectedSolutions(prev => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[solutionText] = '100%'; // Default to 100% agreement
      } else {
        delete newSelected[solutionText];
      }
      return newSelected;
    });
  };

  const handleAgreementChange = (solutionText: string, agreement: string) => {
    setSelectedSolutions(prev => ({
      ...prev,
      [solutionText]: agreement,
    }));
  };
  
  const isAnySolutionSelected = Object.keys(selectedSolutions).length > 0;

  return (
    <Card>
       <CardHeader>
        <CardTitle className="mt-2">{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Select solutions and your level of agreement:</h4>
          <div className="space-y-6">
            {poll.solutions.map((solution, index) => (
              <div key={`${poll.title}-sol-${index}`} className="p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id={`${poll.title}-sol-${index}`}
                    onCheckedChange={(checked) => handleCheckboxChange(solution.text, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={`${poll.title}-sol-${index}`} className="font-normal text-base leading-snug">
                      {solution.text}
                    </Label>
                    {selectedSolutions[solution.text] && (
                        <div className="w-full sm:w-1/2">
                          <Select 
                            value={selectedSolutions[solution.text]} 
                            onValueChange={(value) => handleAgreementChange(solution.text, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Set agreement level" />
                            </SelectTrigger>
                            <SelectContent>
                              {agreementLevels.map(level => (
                                <SelectItem key={level} value={level}>{level} Agreement</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!isAnySolutionSelected}>
          Submit Votes for "{poll.title}"
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function InternationalIssuesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">International Issues Voting</h1>
          <p className="text-muted-foreground">
            Explore and vote on solutions for the world's most pressing challenges.
          </p>
        </div>

        <div className="space-y-6">
            {internationalIssues.map((issue, index) => (
                <PollCard key={index} poll={issue} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
