import * as React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'

import './header.css'

class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="header">
                    <div className="header__left">
                        <div className="header__left-nav">
                            <div className="header__left-nav-link">
                                <Link href="/">
                                    <a className="header__left-nav-logo">B</a>
                                </Link>
                            </div>
                            <div className="header__left-nav-link">
                                <Link href="/">
                                    <a>Collection</a>
                                </Link>
                            </div>
                            <div className="header__left-nav-link">
                                <Link href="/upload">
                                    <a>Upload</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="header__center">
                        <div className="header__center-search">
                            <input
                                type="search"
                                name="search"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header__right-nav">
                            <div className="header__right-nav-notification-icon">
                                <a href="#">
                                    <i className="fa fa-bell" />
                                </a>
                            </div>
                            <div className="header__right-nav-user-profile">
                                user
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

const mapStateToProps = ({ user }: any) => ({ user })

export default connect(mapStateToProps)(Header)
