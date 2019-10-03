import { ViewEncapsulation, Renderer2, Component, ChangeDetectorRef, OnInit, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FoldersService } from '../../../services/component/folders.service';
import { GlobalVariables } from '../../../global.variables';
import { VideosService } from '../../../services/component/videos.service';

const VIDEOJS_URL = '/assets/js/video.min.js';
const CHROMECAST_PLUGIN_URL = '/assets/js/silvermine-videojs-chromecast.min.js';
const CHROMECAST_SENDER_URL = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

@Component({
    templateUrl: '../../../html/video-page/video-page.component.html',
    styleUrls: ['../../../css/video-page.component.css', '../../../../assets/css/video-js.min.css', '../../../../assets/css/silvermine-videojs-chromecast.min.css'],
    encapsulation: ViewEncapsulation.None
})

export class VideoPageComponent implements OnInit, AfterViewChecked, OnDestroy {

    public interval: any;
    public userId: string;
    public videoId: string;
    public cloud: string;
    public fileId: string;
    public videoInfo: any     = {
        progress: 0
    };
    public convert: boolean   = false;
    public video: any         = false;
    public poster: string     = '';
    public pageTitle: string  = 'Video';

    private videoJS: any;

    constructor(
        private route          : ActivatedRoute,
        private router         : Router,
        private foldersService : FoldersService,
        private videosService  : VideosService,
        private titleService   : Title,
        private cdRef          : ChangeDetectorRef,
        private renderer       : Renderer2
    ) {
        this.videoId    = this.route.snapshot.params.id;

        if (Object.keys(this.route.snapshot.data['file']).length) {
            this.video     = this.route.snapshot.data['file'].video;
            this.poster    = this.video.url ? this.video.url.replace(/ffmpeg/gi, 'thumbnails').replace(/\.mp4/gi, '_thumbnail_320x240_01.png') : '';
            this.videoInfo = this.route.snapshot.data['file'].video_info;
            this.pageTitle = this.video.title;
            this.fileId    = this.video.id;
            this.cloud     = this.video.cloud;

            if (this.videoInfo.progress >= 100) {
                this.convert = true;
            } else if (!this.video.hash) {
                this.convert = true;
            }
        }
    }

    ngOnInit() {
        if (!Object.keys(this.video).length) {
            return this.router.navigate(['/error-404']);
        }

        this.titleService.setTitle('NZB Cloud | ' + this.pageTitle);

        const self: any = this;
        this.userId     = GlobalVariables.LOGGED_USER_ID;

        if (!this.convert && this.video.hash) {
            this.interval = setInterval(function() {
                self.videosService.getVideoInfo(self.video.hash).then(function(videoInfo: any) {
                    self.videoInfo = videoInfo.video;

                    if (self.videoInfo.progress >= 100 && self.videoInfo.status == GlobalVariables.VIDEO_CONVERTING_STATUS.StatusUploaded) {
                        self.convert = true;
                        self.initializeVideo();
                        clearInterval(self.interval);
                    }
                });
            }, 1000);
        } else {
            this.initializeVideo();
        }
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        return this.videoJS && this.videoJS.dispose();
    }

    /**
     * Get File link
     *
     */
    public generateLink() {
        return this.foldersService.getFileUrl(this.fileId, this.cloud, this.userId).then((data: any) => {
            if (data.file_url) {
                window.open(data.file_url, '_blank');
            }
        });
    }
    /**
     * Loads scripts and initializes video player
     */
    private async initializeVideo() {
        await this.loadPlayerScripts();
        this.initializePlayer();
    }

    /**
     * Load scripts for video.js
     *
     */
    private async loadPlayerScripts() {
        if (window['videojs'] === undefined) {
            try {
                await this.addScript(VIDEOJS_URL);
                await this.addScript(CHROMECAST_PLUGIN_URL);
                await this.addScript(CHROMECAST_SENDER_URL);
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Initializes video.js player
     */
    private async initializePlayer() {
        const options = {
            controls: true,
            autoplay: false,
            preload: 'auto',
            techOrder: ['chromecast', 'html5'],
            plugins: {
                chromecast: {}
            }
        };

        if (this.videoJS) {
            this.videoJS.load();
        } else {
            this.videoJS = videojs('singleVideo', options);
        }

        this.videoJS.src([
            { type: 'video/mp4', src: this.video.url },
        ]);
    }

    /**
     * Adds <script> element to document body with specified source
     *
     * @param src Source URL
     * @returns Promise<any>
     */
    private addScript(src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            this.renderer.appendChild(document.body, script);
        });
    }
}
