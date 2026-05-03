import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Intake from "@/pages/intake";
import Jurisdiction from "@/pages/jurisdiction";
import ReportPacket from "@/pages/report-packet";
import Dashboard from "@/pages/dashboard";
import Advocacy from "@/pages/advocacy";
import Resources from "@/pages/resources";
import ShelterTracker from "@/pages/shelter-tracker";
import StrayTools from "@/pages/stray-tools";
import UsaMap from "@/pages/usa-map";
import AuthorityDirectory from "@/pages/authority-directory";
import Emergency from "@/pages/emergency";
import Foia from "@/pages/foia";
import Escalation from "@/pages/escalation";
import WitnessStatement from "@/pages/witness-statement";
import StateLaws from "@/pages/state-laws";
import Legislators from "@/pages/legislators";
import PatternDetector from "@/pages/pattern-detector";
import MediaContacts from "@/pages/media-contacts";
import AgencyTracker from "@/pages/agency-tracker";
import EvidenceVault from "@/pages/evidence-vault";
import CaseSummary from "@/pages/case-summary";
import ActionPlan from "@/pages/action-plan";
import HeatEmergency from "@/pages/heat-emergency";
import NationalResources from "@/pages/national-resources";
import ProsecutionGuide from "@/pages/prosecution-guide";
import MyCases from "@/pages/my-cases";
import SurrenderPrevention from "@/pages/surrender-prevention";
import PetTheft from "@/pages/pet-theft";
import HoardingResponse from "@/pages/hoarding-response";
import AnonymousTips from "@/pages/anonymous-tips";
import PuppyMillGuide from "@/pages/puppy-mill-guide";
import SocialCampaign from "@/pages/social-campaign";
import VetAbuseGuide from "@/pages/vet-abuse-guide";
import DogfightingGuide from "@/pages/dogfighting-guide";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/intake" component={Intake} />
      <Route path="/jurisdiction" component={Jurisdiction} />
      <Route path="/report-packet" component={ReportPacket} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/advocacy" component={Advocacy} />
      <Route path="/resources" component={Resources} />
      <Route path="/shelter-tracker" component={ShelterTracker} />
      <Route path="/stray-tools" component={StrayTools} />
      <Route path="/usa-map" component={UsaMap} />
      <Route path="/authority-directory" component={AuthorityDirectory} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/foia" component={Foia} />
      <Route path="/escalation" component={Escalation} />
      <Route path="/witness-statement" component={WitnessStatement} />
      <Route path="/state-laws" component={StateLaws} />
      <Route path="/legislators" component={Legislators} />
      <Route path="/pattern-detector" component={PatternDetector} />
      <Route path="/media-contacts" component={MediaContacts} />
      <Route path="/agency-tracker" component={AgencyTracker} />
      <Route path="/evidence-vault" component={EvidenceVault} />
      <Route path="/case-summary" component={CaseSummary} />
      <Route path="/action-plan" component={ActionPlan} />
      <Route path="/heat-emergency" component={HeatEmergency} />
      <Route path="/national-resources" component={NationalResources} />
      <Route path="/prosecution-guide" component={ProsecutionGuide} />
      <Route path="/my-cases" component={MyCases} />
      <Route path="/surrender-prevention" component={SurrenderPrevention} />
      <Route path="/pet-theft" component={PetTheft} />
      <Route path="/hoarding-response" component={HoardingResponse} />
      <Route path="/anonymous-tips" component={AnonymousTips} />
      <Route path="/puppy-mill-guide" component={PuppyMillGuide} />
      <Route path="/social-campaign" component={SocialCampaign} />
      <Route path="/vet-abuse-guide" component={VetAbuseGuide} />
      <Route path="/dogfighting-guide" component={DogfightingGuide} />
      <Route component={() => <div className="min-h-screen flex items-center justify-center text-white">Not Found</div>} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}