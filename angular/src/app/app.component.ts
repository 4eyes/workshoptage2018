import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private authenticated = false;
  private loggedIn = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private restService: RestService) {
  }

  private availablePenguins;
  private myPenguins;
  private penguinsForSale;
  private currentUser;

  private penguinForSale;
  private addForSaleInProgress = false;

  private soldPenguin;
  private saleInProgress = false;

  private penguinOfferdFor;
  private makeOfferInProgress = false;

  private buyInProgress = false;
  private boughtPenguin;

  private signUpInProgress = false;

  @ViewChild('signupForm') signupForm;

  private signUp = {
    id: '',
    firstName: '',
    surname: '',
  };

  private CONGAS = ['green', 'blue', 'purple'];

  private congaName;

  ngOnInit() {
    this.route
      .queryParams
      .subscribe((queryParams) => {
        const loggedIn = queryParams['loggedIn'];
        if (loggedIn) {
          this.authenticated = true;
          return this.router.navigate(['/'])
            .then(() => {
              return this.checkWallet();
            });
        }
      });
  }

  checkWallet() {
    return this.restService.checkWallet()
      .then((results) => {
        if (results['length'] > 0) {
          this.loggedIn = true;
          return this.getCurrentUser()
            .then(() => {
              this.congaName = this.CONGAS[this.getRandomIntInclusive(0, this.CONGAS.length - 1)];
              return this.getAvailablePenguins();
            })
            .then(() => {
                return this.getPenguinsForSale();
            })
            .then(() => {
              return this.getMyPenguins();
            });
        }
      });
  }

  onSignUp() {
    this.signUpInProgress = true;
    return this.restService.signUp(this.signUp)
      .then(() => {
        return this.getCurrentUser();
      })
      .then(() => {
        this.congaName = this.CONGAS[this.getRandomIntInclusive(0, this.CONGAS.length - 1)];
        return this.getAvailablePenguins();
      })
      .then(() => {
          return this.getPenguinsForSale();
      })
      .then(() => {
        return this.getMyPenguins();
      })
      .then(() => {
        this.loggedIn = true;
        this.signUpInProgress = false;
      });
  }

  getCurrentUser() {
    return this.restService.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser;
      });
  }

  setupDemo(): Promise<any> {
    return this.restService.setupDemo().then(() => {
      this.getAvailablePenguins();
    });
  }

  getAvailablePenguins() {
    this.availablePenguins = this.restService.getAvailablePenguins();
  }

  getMyPenguins() {
    return this.restService.getMyPenguins()
      .then((penguins) => {
        for (let key of Object.keys(penguins)) {
            let penguin = penguins[key];
            this.restService.getPenguinOffer(penguin.name)
                .then((offers) => {
                  penguin.offer = offers[0];
                })
        }
        this.myPenguins = penguins;
      });
  }

  getPenguinsForSale() {
      this.penguinsForSale = this.restService.getPenguinsForSale();
  }

  buyPenguin(penguinId) {
    this.buyInProgress = true;
    this.boughtPenguin = penguinId;
    return this.restService.buyPenguin(penguinId, this.currentUser)
      .then(() => {
        return this.getAvailablePenguins();
      })
      .then(() => {
          return this.getPenguinsForSale();
      })
      .then(() => {
        return this.getMyPenguins();
      })
      .then(() => {
        this.boughtPenguin = null;
        this.buyInProgress = false;
      });
  }

  sellPenguin(penguinId, newOwner) {
      this.saleInProgress = true;
      this.soldPenguin = penguinId;
      return this.restService.sellPenguin(penguinId, newOwner)
          .then(() => {
              return this.getAvailablePenguins();
          })
          .then(() => {
              return this.getPenguinsForSale();
          })
          .then(() => {
              return this.getMyPenguins();
          })
          .then(() => {
              this.soldPenguin = null;
              this.saleInProgress = false;
          });
  }

  makeOffer(penguinId, unit, collectorId) {
      this.makeOfferInProgress = true;
      this.penguinOfferdFor = penguinId;
    return this.restService.makeOffer(penguinId, unit, collectorId)
      .then(() => {
        return this.getAvailablePenguins();
      })
      .then(() => {
          return this.getPenguinsForSale();
      })
      .then(() => {
          return this.getMyPenguins();
      })
      .then(() => {
          this.penguinOfferdFor = null;
          this.makeOfferInProgress = false;
      });
  }

  addPenguinForSale(penguinId) {
    this.addForSaleInProgress = true;
    this.penguinForSale = penguinId;
    return this.restService.addPenguinForSale(penguinId)
      .then(() => {
          return this.getAvailablePenguins();
      })
      .then(() => {
          return this.getPenguinsForSale();
      })
      .then(() => {
          return this.getMyPenguins();
      })
      .then(() => {
          this.penguinForSale = null;
          this.addForSaleInProgress = false;
      });
  }

  private getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
