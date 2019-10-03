import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FoldersModel } from '../../../models/folders.model';
import { FilesComponent } from '../files.component';
import { FoldersService } from '../../../services/component/folders.service';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { GlobalVariables } from '../../../global.variables';
import { Subscription } from 'rxjs';
import * as Helper from '../../../pipes/helpers/helpers';

@Component({
    selector: 'dropbox-tab',
    templateUrl: '../../../html/files/dropbox-tab.component.html'
})

export class DropboxTabComponent implements OnInit {

    @Output()
    public deleteFoldersData: any     = new EventEmitter();

    @Output()
    public createFolderStructure: any = new EventEmitter();

    @Output()
    public deleteFolder: any          = new EventEmitter();

    public userId: string;
    public perPage: number;
    public currentPage: number;
    public linkSize: number;
    public helper: any;
    public foldersStructure: any;
    public folderId: string;
    public paramsSubscription: Subscription;
    public isAllChecked: boolean  = false;

    @Input() folders;
    @Input() deletedFolder;
    @Input() foldersCheckData: any = [];
    @Input() dirId;

    constructor(
        private foldersService : FoldersService,
        private filesComponent : FilesComponent,
        private route          : ActivatedRoute,
        private router         : Router,
        private foldersModel   : FoldersModel
    ) {}

    ngOnInit() {
        if (GlobalServices.isLogged()) {
            const self: any = this;
            this.helper     = Helper;
            this.userId     = GlobalVariables.LOGGED_USER_ID;

            this.paramsSubscription = this.route.queryParams.subscribe(params => {
                if (GlobalServices.isLogged()) {
                    self.getFolders();

                    if (params.dir) {
                        self.folderId = params.dir;
                        self.filesComponent.updateFolders(self.folderId, self.foldersStructure);
                    }
                }
            });
        }
    }

    ngOnChanges() {
        if (this.deletedFolder) {
            return this.getFolders();
        }
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    /**
     * Get File link
     *
     * @param fileId
     * @param cloud
     */
    public generateLink(fileId: string, cloud: string) {
        this.foldersService.getFileUrl(fileId, cloud, this.userId).then((data: any) => {
            if (data.file_url) {
                window.open(data.file_url, '_blank');
            }
        });
    }

    /**
     * Get user folders
     */
    public getFolders() {
        let folderFromStorage: any = this.foldersModel.getFolders();

        // if(folderFromStorage && folderFromStorage.dropbox) {
        //     const self: any = this;
        //     setTimeout(function() {
        //         self.foldersStructure = folderFromStorage.dropbox;
        //         self.createStructure();
        //     }, 30);
        // } else {
            const userData: any = {
                'user_id': this.userId,
                'type'   : 'dropbox'
            };
            this.foldersService.getFolders(userData).then((data: any) => {
                if (data.status) {
                    if (!folderFromStorage) {
                        folderFromStorage = new Object();
                    }

                    this.foldersStructure = data.folders;
                    folderFromStorage.dropbox = data.folders;

                    this.foldersModel.updateFolders(folderFromStorage);
                    this.createStructure();
                }
            });
        // }
    }

    /**
     * Create Folder structure
     */

    /**
     * Create Folder structure
     */
    public createStructure() {
        this.isAllChecked = false;

        this.createFolderStructure.emit({
            folder_id        : this.folderId,
            folder_structure : this.foldersStructure
        });
    }

    /**
     * Opend delete
     *
     * @param id
     */
    public openDeleteFolderModal(id: string) {
        this.deleteFolder.emit({
            id      : id,
            storage : 'dropbox'
        });
    }

    /**
     * Set current page
     *
     * @param page
     */
    public setPage(page: number) {
        this.currentPage       = page;
        const queryParams: any = Object.assign({}, this.route.snapshot.queryParams);
        queryParams['page']    = page;

        this.router.navigate(['files'], { queryParams: queryParams });
        this.getFolders();
    }

    /**
     * Check if selected files count > 0 and same time get count of selected files
     *
     * @returns {any}
     */
    public checkCountOfSelected() {
        let count: number = 0;

        for (const i in this.foldersCheckData) {
            if (this.foldersCheckData[i].check) {
                count++;
            }
        }

        return count;
    }

    /**
     *
     * @param event
     * @param type
     */
    public check(event: any, type: string = 'one') {
        this.deleteFoldersData.emit({
            type : 'check',
            data : event
        });

        if (this.checkCountOfSelected() == Object.keys(this.foldersCheckData).length) {
            this.isAllChecked = true;
        } else {
            this.isAllChecked = false;
        }
    }
}
