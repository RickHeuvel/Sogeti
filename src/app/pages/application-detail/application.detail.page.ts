import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../services/application.service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-application.detail',
    templateUrl: './application.detail.page.html',
    styleUrls: ['./application.detail.page.scss'],
})
export class ApplicationDetailPage implements OnInit {
    Id = null;
    intakeMomentMedicines = [];
    intakeMomentDetail;

    constructor(private activatedRoute: ActivatedRoute, private applicationService: ApplicationService, private navCtrl: NavController) {
    }

    ngOnInit() {
        this.Id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getApplicationDetail();
    }

    getApplicationDetail() {
        const applicationObservable = this.applicationService.getApplicationById(this.Id);
        applicationObservable.subscribe(
            data => {
                this.intakeMomentMedicines = (data[0].intake_moment_medicines[0].dosage !== null ? data[0].intake_moment_medicines : null);
                this.intakeMomentDetail = data[0];
            },
            error => {
                console.log(error);
            });
    }

    submit() {
        this.intakeMomentMedicines.forEach((elem) => {
            if (elem.checked) {
                elem.completed_at = new Date();
                delete (elem.checked);
                this.applicationService.setApplicationCompletion(this.Id, elem).subscribe();
            }
        });
    }
    delete(item) {
        item.completed_at = null;
        this.applicationService.removeApplicationCompletion(this.Id, item).subscribe();
    }

    canSend(): boolean {
        return this.intakeMomentMedicines.filter(elem => elem.completed_at === null).length === 0;
    }
    back() {
        this.navCtrl.navigateBack('/tabs/agenda');
    }
}
