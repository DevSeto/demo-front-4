import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoldersModel } from '../../../models/folders.model';
import { FoldersService } from '../../../services/component/folders.service';
import { UsersService } from '../../../services/component/users.service';
import { GlobalServices } from '../../../services/global/global.services';
import { GlobalVariables } from '../../../global.variables';
import { PaginationConfig } from '../../../configs/pagination.config';
import * as Helper from '../../../pipes/helpers/helpers';
import { Subscription } from 'rxjs';

@Component({
    selector: 'default-tab',
    templateUrl: '../../../html/files/default-tab.component.html'
})

export class DefaultTabComponent implements OnInit, OnChanges {

    @Output()
    public deleteFoldersData: any     = new EventEmitter();

    @Output()
    public createFolderStructure: any = new EventEmitter();

    @Output()
    public deleteFolder: any          = new EventEmitter();

    public folderCount: number;
    public perPage: number;
    public currentPage: number;
    public linkSize: number;
    public userId: string;
    public helper: any;
    public cloud: any;
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
        private route          : ActivatedRoute,
        private router         : Router,
        private foldersModel   : FoldersModel
    ) {
        this.route.queryParams.subscribe(params => {
            if (GlobalServices.isLogged()) {
                if (params.cloud) {
                    this.cloud = params.cloud;
                } else {
                    this.cloud = '';
                }
            }
        });

        const self: any = this;
        this.perPage    = PaginationConfig.perPage;
        this.linkSize   = PaginationConfig.linkSize;
    }

    ngOnInit() {
        if (GlobalServices.isLogged()) {
            const self: any = this;
            this.helper     = Helper;
            this.userId     = GlobalVariables.LOGGED_USER_ID;

            this.paramsSubscription = this.route.queryParams.subscribe(params => {
                if (GlobalServices.isLogged()) {
                    if (params.page) {
                        this.currentPage = params.page;
                    } else {
                        this.currentPage = 1;
                    }

                    if (params.dir) {
                        this.folderCount = 0;
                        this.folderId    = params.dir;
                        this.createStructure();
                    } else {
                        this.folderId = '';
                        return self.getFolders();
                    }
                }
            });

            return this.getFolders();
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
        const offset: number       = (this.currentPage - 1) * this.perPage + 1;
        const userData: any        = {
            'user_id': this.userId,
            'type'   : 's3',
            'offset' : offset,
            'limit'  : this.perPage
        };

        this.foldersService.getFolders(userData).then((data: any) => {
            if (data.status) {
                if (!folderFromStorage) {
                    folderFromStorage = new Object();
                }

                this.foldersStructure = data.folders;

                if (!this.folderId) {
                    this.folderCount = data.count;
                }

                folderFromStorage.s3  = data.folders;

                this.foldersModel.updateFolders(folderFromStorage);
                this.createStructure();

                this.deletedFolder = false;

                if (!data.folders.length) {
                    if (this.cloud != '') {
                        this.router.navigate(['/files'], {
                            queryParams: {
                                cloud: this.cloud
                            }
                        });
                    } else {
                        this.router.navigate(['/files']);
                    }
                }
            }
        });
    }

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
            storage : 's3'
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
