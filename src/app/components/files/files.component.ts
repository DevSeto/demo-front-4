import { Component, OnInit, ViewEncapsulation, Renderer2, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { StorageModel } from '../../models/storage.model';
import { FoldersService} from '../../services/component/folders.service';
import { UsersService } from '../../services/component/users.service';
import { GlobalServices } from '../../services/global/global.services';
import { TitleService } from '../../services/global/title.service';
import { NavigationService } from '../../modules/navigation/service/navigation.service';
import { GlobalVariables } from '../../global.variables';
import { DiffPipe } from '../../pipes/array/diff';

@Component({
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../html/files/files.component.html',
    styleUrls: ['../../css/files.component.css'],
    providers: [ DiffPipe ]
})

export class FilesComponent implements OnInit {
    @ViewChild('deleteModalTmpl') deleteModalTmpl: ModalDirective;

    public modalRef: any;
    public userId: string;
    public dirId: string;
    public cloud: string;
    public deletedFolder: boolean     = false;
    public countOfSelected: boolean   = false;
    public externalStorages: any      = {
        gdrive   : false,
        dropbox  : false,
        onedrive : false
    };
    public folders: any               = [];
    public foldersCheckData: any      = [];
    public deleteFromStorage = false;

    constructor(
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
        private foldersService: FoldersService,
        private usersService: UsersService,
        private navService: NavigationService,
        private diffPipe: DiffPipe,
        private titleService: TitleService,
        private storageModel: StorageModel
    ) {
        this.route.queryParams.subscribe(params => {
            if (GlobalServices.isLogged()) {
                if (params.cloud) {
                    this.cloud = params.cloud;
                } else {
                    this.cloud = '';
                }

                if (!params.dir) {
                    this.navService.empty();
                }
            }
        });

        this.getUserExternalStorages();
    }

    ngOnInit() {
        this.titleService.setPageTitle('files.page_title');
        this.userId = GlobalVariables.LOGGED_USER_ID;
    }

    /**
     * Search in array
     *
     * @param folders
     * @param folderId
     * @returns {any}
     */
    public arraySearch(folders: any, folderId: string, ) {
        const param: any = this.router.parseUrl(this.router.url);
        if (folders) {
            let foldersCount = folders.length;

            if (typeof foldersCount == 'undefined') {
                foldersCount = Object.keys(folders).length;
            }

            for (let i = 0; i < foldersCount; i++) {
                if (typeof folders[i] !== 'undefined') {
                    if (typeof folders[i].folder_id !== 'undefined' && folders[i].folder_id == folderId) {
                        if (param.queryParams.dir) {
                            this.navService.pushNav({
                                path        : folders[i].folder_id,
                                folder_name : folders[i].folder_name
                            });
                        }

                        return folders[i].sub_folder;
                    }

                    const subFolders: object = this.arraySearch(folders[i].sub_folder, folderId);

                    if (subFolders) {
                        if (param.queryParams.dir) {
                            this.navService.pushNav({
                                path        : folders[i].folder_id,
                                folder_name : folders[i].folder_name
                            });
                        }

                        return subFolders;
                    }
                }
            }
        }
    }

    /**
     * Empty url and change storage tab
     *
     * @param event
     */
    public emptyUrl(event: any) {
        const cloud: string = event.nextId;
        this.folders        = [];

        if (cloud != 'nzbcloud') {
            this.router.navigate(['/files'], {
                queryParams: {
                    cloud: cloud
                }
            });
        } else {
            this.router.navigate(['/files']);
        }

        this.navService.empty();
    }

    public createStructure(event: any) {
        const folderId: string      = event.folder_id;
        const foldersStructure: any = event.folder_structure;

        this.updateFolders(folderId, foldersStructure);
    }

    /**
     * Update page folders
     *
     * @param folderId
     * @param foldersStructure
     */
    public updateFolders(folderId: string, foldersStructure: any) {
        let foldersSearch: object;
        this.folders          = [];
        let folders: any      = [];
        let foldersData: any  = [];
        this.foldersCheckData = [];
        this.countOfSelected  = false;
        this.navService.empty();

        if (!folderId) {
            for (const i in foldersStructure) {
                if (foldersStructure.hasOwnProperty(i)) {
                    for (const a in foldersStructure[i]) {
                        if (foldersStructure[i].hasOwnProperty(a)) {
                            if (Object.keys(foldersStructure[i][a])[0] == 'file_data') {
                                this.folders.push(foldersStructure[i][a].file_data);
                            } else {
                                const folderData: any = {
                                    name    : foldersStructure[i][a].folder_name,
                                    id      : foldersStructure[i][a].folder_id,
                                    size    : foldersStructure[i][a].folder_size,
                                    path    : foldersStructure[i][a].obj_path,
                                    pr_path : foldersStructure[i][a].pr_obj_path,
                                    amount  : foldersStructure[i][a].amount_of_files,
                                    type    : false
                                };

                                this.folders.push(folderData);

                                if (!this.foldersCheckData[foldersStructure[i][a].folder_id]) {
                                    this.foldersCheckData[foldersStructure[i][a].folder_id] = {
                                        check   : false,
                                        path    : foldersStructure[i][a].obj_path,
                                        pr_path : foldersStructure[i][a].pr_obj_path
                                    };
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (const i in foldersStructure) {
                if (foldersStructure.hasOwnProperty(i)) {
                    foldersSearch = this.arraySearch(foldersStructure[i], folderId);

                    if (foldersSearch) {
                        this.dirId = foldersStructure[i][0]._id;
                        folders    = foldersSearch;
                    }
                }
            }

            for (const i in folders) {
                if (folders.hasOwnProperty(i) && typeof folders[i].folder_id !== 'undefined') {
                    foldersData = {
                        name    : folders[i].folder_name,
                        id      : folders[i].folder_id,
                        size    : folders[i].folder_size,
                        path    : folders[i].obj_path,
                        pr_path : folders[i].pr_obj_path,
                        amount  : folders[i].amount_of_files,
                        link    : folders[i].folder_id,
                        type    : false
                    };

                    this.folders.push(foldersData);

                    if (!this.foldersCheckData[folders[i].folder_id]) {
                        this.foldersCheckData[folders[i].folder_id] = {
                            check   : false,
                            path    : folders[i].obj_path,
                            pr_path : folders[i].pr_obj_path
                        };
                    }
                } else {
                    for (const a in folders[i]) {
                        if (folders[i].hasOwnProperty(a) && folders[i][a]) {
                            let fileId: string;
                            if (folders[i][a].file_id && folders[i][a].cloud_type !== 'dropbox') {
                                fileId = folders[i][a].file_id;
                            } else {
                                fileId = folders[i][a].real_path;
                            }

                            foldersData = {
                                id       : folders[i][a].id,
                                name     : folders[i][a].name,
                                size     : folders[i][a].size,
                                path     : folders[i][a].obj_path,
                                pr_path  : folders[i][a].pr_obj_path,
                                type     : folders[i][a].type,
                                link     : '',
                                fileId   : fileId,
                                folderId : folders[i][a].folder_id,
                                video    : JSON.parse(folders[i][a].video),
                                amount   : ''
                            };

                            if (!this.foldersCheckData[folders[i][a].id]) {
                                this.foldersCheckData[folders[i][a].id] = {
                                    check   : false,
                                    path    : folders[i][a].obj_path,
                                    pr_path : folders[i][a].pr_obj_path
                                };
                            }

                            if (foldersData.video == true) {
                                foldersData.convert = JSON.parse(folders[i][a].video_convert);
                            }

                            this.folders.push(foldersData);
                        }
                    }
                }
            }
        }

        this.navService.done();
    }

    /**
     * Get user external storages
     */
    public getUserExternalStorages() {
        const self: any = this;

        if (this.storageModel.getUserStorages()) {
            const storages: any = this.storageModel.getUserStorages();
            storages.forEach(item => {
                const storage: any             = item.storage;
                self.externalStorages[storage] = true;
            });
        } else {
            const storages: any = [];
            this.usersService.getUserStorages(GlobalVariables.LOGGED_USER_ID).then((data: any) => {
                if (data.status) {
                    data.user_storages.forEach(item => {
                        const storage: any             = item.storage_type;
                        self.externalStorages[storage] = true;

                        self.usersService.getStorageSpace(storage, self.userId).then((res: any) => {
                            if (res.space) {
                                storages.push(res.space);
                                if (self.getCount() == storages.length) {
                                    self.storageModel.updateUserStorages(storages);
                                }
                            }
                        });
                    });
                }
            });
        }
    }

    /**
     * Get count storage
     */
    public getCount() {
        let count   = 0;
        const storages: any = this.externalStorages;

        Object.keys(storages).map(function(objectKey, index) {
            const storage: any = storages[objectKey];
            if (storage) {
                count++;
            }
        });

        return count;
    }

    /**
     * Select folder
     *
     * @param event
     */
    public folderHandler(event: any) {
        const type: string = event.type;
        const data: any    = event.data;

        if (type == 'check') {
            this.checkFolder(data);
        }
    }

    /**
     * Open delete Modal
     *
     * @param data
     */
    public deleteFolderModal(data: any) {
        this.deleteFromStorage = false;
        this.deleteModalTmpl.show();

        if (data && data.id !== '') {
            this.setAll(false);
            this.foldersCheckData[data.id].check = true;
            this.checkCountOfSelected();
        }
    }


    /**
     * Delete selected folder
     */
    public deleteFolder() {
        const self: any        = this;
        const foldersData: any = [];
        const cloud: string    = this.cloud ? this.cloud : 's3';

        for (const id in this.foldersCheckData) {
            if (this.foldersCheckData[id].check) {
                foldersData.push({
                    id      : id,
                    path    : this.foldersCheckData[id].path,
                    pr_path : this.foldersCheckData[id].pr_path,
                    cloud   : cloud,
                    storage : this.deleteFromStorage
                });
            }
        }

        this.deleteModalTmpl.hide();

        this.foldersService.deleteFolder(foldersData).then((data: any) => {
            this.deletedFolder = true;

            for (const id in this.foldersCheckData) {
                if (this.foldersCheckData[id].check) {
                    delete this.foldersCheckData[id];
                }
            }

            this.checkCountOfSelected();

            setTimeout(function() {
                self.deletedFolder = false;
            });
        });
    }

    /**
     * Check if selected files count > 0 and same time get count of selected files
     *
     * @param countCheck
     * @returns {any}
     */
    public checkCountOfSelected(countCheck: boolean = false) {
        let count = 0;

        for (const i in this.foldersCheckData) {
            if (this.foldersCheckData[i].check) {
                count++;
            }
        }

        this.countOfSelected = count > 0;

        if (countCheck) {
            return count;
        }

        return count > 0;
    }

    /**
     * Set checked all files
     *
     * @param value
     */
    public setAll(value: boolean) {
        for (const i in this.foldersCheckData) {
            if (this.foldersCheckData.hasOwnProperty(i)) {
                this.foldersCheckData[i].check = value;
            }
        }
    }

    /**
     * Check folder
     *
     * @param event
     */
    public checkFolder(event: any) {
        if (event.target.checked && event.target.value == 'all') {
            this.setAll(true);
        } else if (!event.target.checked && event.target.value == 'all') {
            this.setAll(false);
        } else if (event.target.checked) {
            this.foldersCheckData[event.target.value].check = true;
        } else {
            this.foldersCheckData[event.target.value].check = false;
        }

        this.checkCountOfSelected();
    }
}
