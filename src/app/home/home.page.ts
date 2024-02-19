import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slides: Array<{ title: string, subtitle: string, icon?: string,logo?: string }> = [
    {
      title: 'Welcome to SBG Securities',
      subtitle: "SBGS retail business unit offers top of the range personalized services and tailor-made solutions to fit clients' needs and wants; while ensuring they meet both local and regional investment strategies through agency network. CDSC Services.",
      logo:'logo'
    },
    {
      title: 'CDSC Services',
      subtitle: "SBG Securities is an appointed Central Depository Agent (CDA) and offers services such as: Account opening, Settlement of shares bought and sold, Settlement of shares bought and sold, Pledge of shares in favour of banks and financial institutions",
      icon: 'link'
    },
    {
      title: 'Equity trading',
      subtitle: 'We provide guidance on the optimal way in which to work orders in the market which relate to large transactions and illiquid counters.',
      icon: 'engineering'
    }
  ]

  constructor() {}

}
